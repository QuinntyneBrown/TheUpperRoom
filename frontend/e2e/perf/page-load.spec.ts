// Traces to: 63 — Page-load performance budget harness
// L2-046: each primary screen passes LCP < 2.5s under Slow 4G + 4× CPU throttle
import { test, expect } from '@playwright/test';
import type { CDPSession } from '@playwright/test';

const LCP_BUDGET_MS = 2500;

// Throttling only applied when running against a production build (CI or PERF_THROTTLE=true).
// Dev-server bundles are too large to meet budgets under Slow 4G.
const THROTTLE_ENABLED = process.env['CI'] === 'true' || process.env['PERF_THROTTLE'] === 'true';

// Slow 4G network conditions (Chrome DevTools preset)
const SLOW_4G = {
  offline: false,
  downloadThroughput: (450 * 1024) / 8,
  uploadThroughput: (150 * 1024) / 8,
  latency: 400,
};

interface PerfScreen {
  name: string;
  path: string;
  readyAttr: string;
  implemented: boolean;
}

const SCREENS: PerfScreen[] = [
  { name: 'dashboard', path: '/dashboard', readyAttr: 'dashboard', implemented: true },
  { name: 'contacts', path: '/contacts', readyAttr: 'contacts', implemented: false },
  { name: 'partners', path: '/partners', readyAttr: 'partners', implemented: false },
  { name: 'partner-board', path: '/partners/board', readyAttr: 'partner-board', implemented: false },
  { name: 'hackathons', path: '/hackathons', readyAttr: 'hackathons', implemented: false },
  { name: 'search', path: '/', readyAttr: 'search', implemented: false },
];

async function applyThrottle(cdp: CDPSession): Promise<void> {
  if (!THROTTLE_ENABLED) return;
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', SLOW_4G);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
}

async function measureLcp(cdp: CDPSession, page: import('@playwright/test').Page, path: string, readyAttr: string): Promise<number> {
  await applyThrottle(cdp);
  await page.goto(path);
  await page.waitForSelector(`[data-perf-ready="${readyAttr}"]`, { timeout: 10_000 });

  return page.evaluate(() =>
    new Promise<number>(resolve => {
      let lastLcp = 0;
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          lastLcp = entries[entries.length - 1].startTime;
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      // Give LCP observer a tick to process buffered entries
      requestAnimationFrame(() => {
        observer.disconnect();
        resolve(lastLcp || performance.now());
      });
    })
  );
}

for (const screen of SCREENS) {
  test(`${screen.name}: LCP < ${LCP_BUDGET_MS}ms under Slow 4G`, async ({ page, context }) => {
    if (!screen.implemented) {
      test.fixme(true, `Route ${screen.path} not yet implemented`);
      return;
    }

    const cdp = await context.newCDPSession(page);
    const lcp = await measureLcp(cdp, page, screen.path, screen.readyAttr);

    expect(lcp, `${screen.name} LCP ${lcp.toFixed(0)}ms exceeds budget ${LCP_BUDGET_MS}ms`).toBeLessThan(LCP_BUDGET_MS);
  });
}

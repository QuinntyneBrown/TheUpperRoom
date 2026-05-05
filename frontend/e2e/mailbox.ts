// Mailpit client for E2E email verification
// Mailpit default API: http://localhost:8025/api/v1
const BASE = process.env['MAILPIT_URL'] ?? 'http://localhost:8025';

export interface MailMessage {
  ID: string;
  Subject: string;
  To: Array<{ Address: string }>;
  HTML: string;
  Text: string;
}

export class Mailbox {
  async latestTo(email: string): Promise<MailMessage | null> {
    const res = await fetch(`${BASE}/api/v1/messages?limit=50`);
    const data = await res.json() as { messages: MailMessage[] };
    return data.messages.find(m => m.To.some(t => t.Address === email)) ?? null;
  }

  async waitForEmail(email: string, timeoutMs = 10_000): Promise<MailMessage> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const msg = await this.latestTo(email);
      if (msg) return msg;
      await new Promise(r => setTimeout(r, 500));
    }
    throw new Error(`No email for ${email} within ${timeoutMs}ms`);
  }

  async deleteAll() {
    await fetch(`${BASE}/api/v1/messages`, { method: 'DELETE' });
  }
}

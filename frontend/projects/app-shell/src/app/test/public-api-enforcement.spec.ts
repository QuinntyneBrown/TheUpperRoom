// Traces to: 75 - component library public API enforcement
// L2-060: direct Material imports in feature code are blocked by ESLint
import { describe, it, expect } from 'vitest';
import { Linter } from 'eslint';

const RESTRICTED_RULE = {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['@angular/material', '@angular/material/*'],
          message: 'Import Angular Material via the components library instead.',
        },
        {
          group: ['@angular/cdk', '@angular/cdk/*'],
          message: 'Import Angular CDK via the components library instead.',
        },
      ],
    },
  ],
} as const;

function lint(code: string): import('eslint').Linter.LintMessage[] {
  const linter = new Linter({ configType: 'flat' });
  return linter.verify(code, [
    { rules: RESTRICTED_RULE as Record<string, unknown> },
  ]);
}

describe('no-restricted-imports enforcement', () => {
  it('flags direct @angular/material import', () => {
    const msgs = lint(`import { MatButtonModule } from '@angular/material/button';`);
    expect(msgs.some((m) => m.ruleId === 'no-restricted-imports')).toBe(true);
  });

  it('flags direct @angular/cdk import', () => {
    const msgs = lint(`import { FocusTrap } from '@angular/cdk/a11y';`);
    expect(msgs.some((m) => m.ruleId === 'no-restricted-imports')).toBe(true);
  });

  it('allows import from components public API', () => {
    const msgs = lint(`import { UrButtonComponent } from 'components';`);
    expect(msgs.some((m) => m.ruleId === 'no-restricted-imports')).toBe(false);
  });
});

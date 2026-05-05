// Traces to: 68 - Injection and stored-XSS hardening checks
// L2-053: lint rule rejects bypassSecurityTrust* calls in project code
import { describe, it, expect } from 'vitest';
import { Linter } from 'eslint';

function lint(code: string): import('eslint').Linter.LintMessage[] {
  const linter = new Linter({ configType: 'flat' });
  return linter.verify(code, [
    {
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: "CallExpression[callee.property.name=/^bypassSecurityTrust/]",
            message: "DomSanitizer.bypassSecurityTrust*() is forbidden.",
          },
        ],
      },
    },
  ]);
}

describe('XSS lint rule', () => {
  it('flags bypassSecurityTrustHtml call', () => {
    const msgs = lint(`sanitizer.bypassSecurityTrustHtml('<b>x</b>');`);
    expect(msgs.some(m => m.ruleId === 'no-restricted-syntax')).toBe(true);
  });

  it('flags bypassSecurityTrustScript call', () => {
    const msgs = lint(`sanitizer.bypassSecurityTrustScript('evil()');`);
    expect(msgs.some(m => m.ruleId === 'no-restricted-syntax')).toBe(true);
  });

  it('allows safe sanitize call', () => {
    const msgs = lint(`const safe = sanitizer.sanitize(SecurityContext.HTML, value);`);
    expect(msgs.some(m => m.ruleId === 'no-restricted-syntax')).toBe(false);
  });
});

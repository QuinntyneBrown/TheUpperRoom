import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const MATERIAL_RESTRICTED = {
  patterns: [
    { group: ['@angular/material', '@angular/material/*'], message: 'Import Angular Material via the components library instead.' },
    { group: ['@angular/cdk', '@angular/cdk/*'], message: 'Import Angular CDK via the components library instead.' },
    { group: ['components/src/lib/*'], message: 'Import only from the public API: import { ... } from "components".' },
  ],
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.angular/**'],
  },
  {
    files: ['e2e/**/*.spec.ts'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='locator']",
          message: 'Use page object selectors — page.locator() is forbidden in test files.',
        },
        {
          selector: "CallExpression[callee.property.name='getByText']",
          message: 'Use page object selectors — page.getByText() is forbidden in test files.',
        },
      ],
    },
  },
  {
    files: ['projects/app-shell/**/*.ts', 'projects/api/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: true },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      'no-restricted-imports': ['error', MATERIAL_RESTRICTED],
    },
  },
];

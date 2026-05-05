# 75 — Component Library Public API Enforcement

**Traces to:** L2-060. L1-016.

Vertical slice: feature libraries import UI primitives only from `components`. Direct Material imports are blocked.

## Status
Accepted

## Components

- Frontend Nx project `frontend/projects/components` — exports branded wrappers (button, dialog, form-field, snackbar, empty-state, loading-state, segmented-control).
- `components/src/public-api.ts` — explicit re-export list. Internal-only files are not exported.
- Lint rule `no-restricted-imports`:
  ```js
  { patterns: ['@angular/material/*', '@angular/cdk/*'], paths: [...] }
  ```
  scoped to all projects except `components`.
- CI step runs `eslint --max-warnings 0` with the rule enabled.

## Acceptance tests (L2-060)

- Lint catches a deliberate `import { MatButtonModule } from '@angular/material/button'` in `feature-contacts`.
- `components/src/public-api.ts` is the only re-export surface; importing from `components/src/lib/...` paths is also blocked by lint.

## Radical simplicity notes

- ESLint configuration is the entire enforcement mechanism — no custom Nx generator, no architecture framework.
- One public-api file is the contract; reviewers see the diff in PRs that change exposed components.

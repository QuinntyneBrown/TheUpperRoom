# Contributing to The Upper Room

Thank you for taking the time to contribute. These guidelines keep the process lightweight and predictable for everyone.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Before You Start](#before-you-start)
- [Development Setup](#development-setup)
- [Branching & Commits](#branching--commits)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating you agree to uphold it. Please report unacceptable behaviour to [quinntynebrown@gmail.com](mailto:quinntynebrown@gmail.com).

---

## Before You Start

1. **Check for an existing issue.** Search [open issues](../../issues) before filing a new one — someone may already be working on it.
2. **Open an issue first for significant changes.** Bug fixes and small improvements can go straight to a PR. New features, architecture changes, or anything that touches multiple vertical slices should be discussed in an issue first.
3. **One concern per PR.** Keep pull requests focused. A PR that fixes a bug and also refactors unrelated code is harder to review and more likely to be rejected.

---

## Development Setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 22 LTS or later |
| .NET SDK | 9.0 or later |
| Angular CLI | `npm i -g @angular/cli` |

### Clone and run

```bash
git clone https://github.com/QuinntyneBrown/TheUpperRoom.git
cd TheUpperRoom

# Backend
cd backend && dotnet restore && dotnet run --project TheUpperRoom.Api

# Frontend (separate terminal)
cd frontend && npm install && npm start
```

---

## Branching & Commits

- Branch from `main`.
- Name branches descriptively: `feature/partner-kanban`, `fix/contact-search-empty-state`, `docs/contributing-guide`.
- Write commit messages in the imperative mood: `Add partner stage transitions`, not `Added` or `Adding`.
- Reference the related issue number in the commit or PR body: `Closes #42`.

---

## Pull Request Process

1. Ensure all tests pass locally before opening a PR (`dotnet test` + `npx playwright test`).
2. Fill in the PR template completely.
3. A maintainer will review within a few business days. Address review comments with new commits — do not force-push to a PR branch under review.
4. Squash or rebase onto `main` when approved. The maintainer will merge.

---

## Coding Standards

### Backend (C#)

- Follow the **feature-first** folder layout: new code belongs inside the relevant feature slice under `TheUpperRoom.Api/Features/`.
- One MediatR command or query per file. Keep handlers focused — no handler should do the work of two.
- Use `nullable enable` throughout. Do not suppress nullable warnings without a comment explaining why.
- No direct `DbContext` usage outside infrastructure — go through MediatR.

### Frontend (TypeScript / Angular)

- All components are **standalone**. Do not add them to NgModules.
- Use the `api` library for every HTTP call. Services must be exposed via injection tokens — never imported directly into feature code.
- Reusable UI belongs in the `components` library. Feature-specific UI stays inside the feature project.
- Keep the app shell thin: no business logic, no direct API calls.
- Run Prettier before committing: `npx prettier --write .`

### General

- The guiding principle is **radically simple** code. If your implementation requires a new abstraction layer or pattern not already used in the codebase, discuss it in the issue first.
- Do not add error handling for scenarios that cannot happen. Trust framework guarantees.
- Comments explain *why*, not *what*. If the code needs a comment to explain what it does, rename the identifiers instead.

---

## Testing Requirements

| Layer | Tool | Requirement |
|---|---|---|
| Backend | xUnit + WebApplicationFactory | Integration tests for every new command and query |
| Frontend units | Vitest | Token-based service tests where applicable |
| E2E | Playwright + Page Object Model | New user flows require a corresponding E2E test |
| Accessibility | axe-core / Playwright | No new WCAG 2.1 AA violations |

All tests must pass in CI before a PR can be merged.

---

## Documentation

If your change affects an end-user flow, update or add the relevant document in `docs/`. For new vertical slices, follow the existing design-document format in `docs/detailed-designs/`.

---

Thank you for helping build tools for the Kingdom.

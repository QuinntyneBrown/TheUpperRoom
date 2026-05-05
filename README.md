<div align="center">

# The Upper Room

**A faith-driven platform for City Leads to coordinate teams, cultivate partnerships, and run hackathons that move the Kingdom of God forward.**

[![Build](https://github.com/QuinntyneBrown/TheUpperRoom/actions/workflows/ci.yml/badge.svg)](https://github.com/QuinntyneBrown/TheUpperRoom/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular)](https://angular.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-contributor%20covenant-ff69b4.svg)](CODE_OF_CONDUCT.md)

**[Overview](#overview)** · **[Features](#features)** · **[Getting Started](#getting-started)** · **[Architecture](#architecture)** · **[Contributing](CONTRIBUTING.md)** · **[Security](SECURITY.md)**

</div>

---

## Overview

The Upper Room is an open-source web platform built for [FaithTech](https://www.faithtech.com/) City Leads — the people coordinating local teams, cultivating corporate partnerships, and running hackathons that produce software for the Kingdom of God.

It provides a single place to manage contacts, track partners through a pipeline, plan hackathons using the FaithTech 4 D's process, and keep a global view of every city team — all in real time.

> The implementation philosophy is **radically simple**: no microservices, no complex DDD, no unnecessary abstractions. Clean vertical slices, CQRS on the backend, and standalone Angular components on the frontend.

---

## Features

| Area | Capability |
|---|---|
| **Contacts** | Create, search, annotate, archive, and restore contacts with full audit logging |
| **Partners** | Pipeline management (Lead → In Funnel → Confirmed) with Kanban board visualization |
| **Hackathons** | Plan and track hackathons following the FaithTech 4 D's — Discover, Design, Develop, Deploy |
| **Teams** | Manage your local city team and discover teams globally with role-based membership |
| **Dashboard** | Personalized, drag-and-drop widgets powered by Chart.js and angular-gridster2 |
| **Real-Time** | Live notifications, metrics, and cross-client updates via Microsoft SignalR |
| **Auth & RBAC** | Session-based authentication with five roles: Prayer Lead, City Lead, Event Lead, Communication Lead, Administrator |
| **Accessibility** | WCAG 2.1 Level AA compliance, keyboard navigation, screen-reader support |

---

## Tech Stack

**Frontend**

- [Angular 21](https://angular.dev/) — standalone components, lazy-loaded routes
- [Angular Material 21](https://material.angular.io/) — dark monochromatic theme
- [Chart.js](https://www.chartjs.org/) — real-time metric charts
- [angular-gridster2](https://github.com/tiberiuzuld/angular-gridster2) — resizable dashboard grid
- [Microsoft SignalR](https://learn.microsoft.com/aspnet/signalr/) — real-time hub client
- [Playwright](https://playwright.dev/) + [axe-core](https://github.com/dequelabs/axe-core) — E2E and accessibility tests

**Backend**

- [ASP.NET Core 9](https://learn.microsoft.com/aspnet/core/) — minimal API controllers
- [MediatR 12](https://github.com/jbogard/MediatR) — CQRS command/query pipeline
- [Entity Framework Core 9](https://learn.microsoft.com/ef/core/) — SQLite (dev) / PostgreSQL (prod)
- [Microsoft SignalR](https://learn.microsoft.com/aspnet/signalr/) — real-time hub server
- [xUnit](https://xunit.net/) + WebApplicationFactory — integration tests

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| [Node.js](https://nodejs.org/) | 22 LTS or later |
| [.NET SDK](https://dotnet.microsoft.com/download) | 9.0 or later |
| [Angular CLI](https://angular.dev/tools/cli) | `npm i -g @angular/cli` |

### 1 — Clone

```bash
git clone https://github.com/QuinntyneBrown/TheUpperRoom.git
cd TheUpperRoom
```

### 2 — Backend

```bash
cd backend
dotnet restore
dotnet run --project TheUpperRoom.Api
# API listening at https://localhost:7001
```

### 3 — Frontend

```bash
cd frontend
npm install
npm start
# App running at http://localhost:4200
```

### 4 — Run tests

```bash
# Backend integration tests
cd backend && dotnet test

# Frontend unit tests
cd frontend && npm test

# E2E tests (requires both servers running)
cd frontend && npx playwright test
```

---

## Architecture

```
TheUpperRoom/
├── backend/
│   ├── TheUpperRoom.Api/          # ASP.NET Core 9 Web API
│   │   ├── Features/              # Vertical slices (Auth, Contacts, Partners …)
│   │   └── Infrastructure/        # EF Core, SignalR, cross-cutting services
│   └── TheUpperRoom.Api.Tests/    # xUnit integration tests
│
└── frontend/
    ├── projects/
    │   ├── app-shell/             # Thin Angular app: routing + layout
    │   ├── components/            # Shared UI library (Material wrappers)
    │   └── api/                   # Models + services exposed via injection tokens
    ├── angular.json
    └── playwright.config.ts
```

The backend organises code by **feature** (not by layer): each vertical slice owns its EF entities, MediatR commands/queries, and controllers. The frontend mirrors this with three distinct Angular projects inside one workspace — keeping the app shell thin and the API surface well-encapsulated.

Full architecture documentation lives in [`docs/detailed-designs/00-architecture/`](docs/detailed-designs/00-architecture/).

---

## Documentation

| Document | Description |
|---|---|
| [L1 Requirements](docs/specs/L1.md) | 18 high-level functional requirements |
| [L2 Requirements](docs/specs/L2.md) | Detailed acceptance criteria for every flow |
| [Architecture](docs/detailed-designs/00-architecture/) | C4 diagrams, domain model, API contracts, DB schema |
| [Detailed Designs](docs/detailed-designs/) | 87 vertical-slice design documents |
| [Gap Audit](docs/detailed-designs-requirements-gap-audit.md) | Coverage analysis between designs and implementation |

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request, and make sure your change is covered by an issue first.

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

---

## Security

To report a security vulnerability, see [SECURITY.md](SECURITY.md). Do **not** open a public issue.

---

## Support

See [SUPPORT.md](SUPPORT.md) for how to ask questions and get help.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for [FaithTech](https://www.faithtech.com/) city teams worldwide.

</div>

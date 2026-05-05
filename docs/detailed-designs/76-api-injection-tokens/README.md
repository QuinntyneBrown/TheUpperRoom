# 76 — API Library Injection-Token Contract

**Traces to:** L2-061. L1-017.

Vertical slice: the `api` library exposes service interfaces and injection tokens; concrete services are provided through tokens; feature unit tests substitute mocks via `TestBed`.

## Status
Accepted

## Components

- Frontend `frontend/projects/api` exports:
  - Models (`Contact`, `Partner`, `Hackathon`, ...).
  - Service interfaces (`IContactService`, `IPartnerService`, `IDashboardService`, ...).
  - Injection tokens (`CONTACT_SERVICE = new InjectionToken<IContactService>('CONTACT_SERVICE')` etc.).
  - Concrete classes (`ContactHttpService`) provided via `{ provide: CONTACT_SERVICE, useClass: ContactHttpService }` in `ApiModule`.
- Feature components inject by token: `inject(CONTACT_SERVICE)`.
- Feature unit tests use `TestBed.configureTestingModule({ providers: [{ provide: CONTACT_SERVICE, useValue: mock }] })`.
- Pilot feature: contacts list (slice 14) is the first to consume this pattern; unit test demonstrates substitution without touching component code.

## Acceptance tests (L2-061)

- Feature component compiles with no direct reference to `ContactHttpService`.
- Unit test substitutes a stub via `CONTACT_SERVICE`; assertions pass without an HTTP test double.

## Radical simplicity notes

- One token per resource service. No service registry, no DI extension package.
- Concrete classes still live in `api` so the rule is visible in one project.

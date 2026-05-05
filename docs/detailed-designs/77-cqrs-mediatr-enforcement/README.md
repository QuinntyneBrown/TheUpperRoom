# 77 — Backend CQRS/MediatR Enforcement

**Traces to:** L2-062. L1-018.

Vertical slice: controllers are one-liners that dispatch a single MediatR request. Architecture tests catch violations at build time.

## Components

- Backend convention: every action method body is `=> Mediator.Send(request)` or `=> Mediator.Send(new TRequest(...))`. No `_db`, `_service`, or other field access.
- Backend `tests/architecture/CqrsRules.cs` (NetArchTest):
  - Every `Controller` class injects only `IMediator`.
  - Every action method's body Roslyn syntax tree contains exactly one `await Mediator.Send(...)` or `return Mediator.Send(...)` invocation.
  - Every command/query has exactly one `IRequestHandler<TRequest, TResponse>` implementation.
- Test fails on any controller injecting a `DbContext`, repository, or domain service.

## Acceptance tests (L2-062)

- Architecture test passes on the existing controllers and fails when a forbidden dependency is injected.
- A new endpoint added without a handler fails the "exactly one handler" assertion.

## Radical simplicity notes

- A focused architecture test is enough. No analyzers, no Roslyn-source-generated controllers.
- Action-body shape is verified by parsing the syntax tree, which keeps the rule precise.

# Architecture Improvement Checklist

This checklist tracks the practical work needed to make the feature slices
consistently follow the project's Clean Architecture / DDD-inspired direction.
It is intentionally incremental: do not introduce richer domain modeling unless
there is a rule or behavior that needs a stable home.

## Dependency Boundaries

- [x] Move playbook read/write gateway contracts that return DTOs into `application/ports`.
- [x] Move session read/write gateway contracts that return DTOs into `application/ports`.
- [x] Move profile read/write gateway contracts that return DTOs into `application/ports`.
- [x] Move the session-context DTO read gateway into `application/ports`.
- [x] Remove application DTO imports from feature domain folders.
- [x] Add an automated test that blocks domain imports from application, infrastructure, and presentation layers.
- [x] Audit the remaining legacy `src/repositories`, `src/lib/services`, and feature `data` paths; the unused Supabase base service/repository and session data repository were removed, with no active callers remaining.
- [x] Decide case-by-case whether a future persistence contract is an application port (DTO/read-model oriented) or a domain repository (aggregate oriented): use an application port for page/query DTOs and writes coordinated by use cases; introduce a domain repository only when an aggregate must be loaded and enforce a domain invariant before persistence.

## DTOs And Read Models

- [x] Name DTOs by their use case when the shape is screen-specific: `GetPlaybookPageOutput`, `GetPlaybooksPageInput`, `SessionListItemDTO`, `PlaybookSummaryDTO`, and `ProfileSummaryDTO` now distinguish page outputs, inputs, lists, and reusable summaries.
- [x] Rename the session list projection to `SessionListItemDTO`; retain `SessionDetailDTO` for single-session reads rather than implying a false card/detail hierarchy.
- [x] Extract `UserSummaryDTO` for repeated creator/instructor display identity across playbooks and sessions.
- [x] Keep page outputs composed from smaller DTOs; the current session page uses only `SessionDetailDTO`, so it correctly does not introduce a redundant `SessionPageDTO`.
- [x] Decouple playbook application inputs from React Hook Form and Zod input types; server actions validate and map into explicit application commands.
- [x] Decouple session create/update and profile update application inputs from form-schema types; actions validate and map boundary input into explicit commands.

## Domain Modeling

- [x] Replace the playbook entity's strategy DTO dependency with a domain `PlaybookStrategy` type.
- [x] Add `PlaybookTitle` and `PlaybookTopic` value objects for the agreed shared rules: trim whitespace and require non-empty values; length and other normalization remain UI/schema policy until product rules require them.
- [x] Make `Session` state transitions explicit and reject invalid transitions: scheduled may become active/canceled, active may become completed/canceled, and completed/canceled are terminal.
- [x] Use domain entities for behavior and invariants, not merely as duplicate database record shapes; playbook metadata and session lifecycle rules now live in domain types.
- [x] Add aggregate methods only for rules that must be true across all entry points: `PlaybookPhaseCollection` validates phase titles and normalizes persisted order. Duplicate source strategies are explicitly allowed because every playbook strategy is an independently editable instance.

## Application And Infrastructure

- [x] Replace leftover broad read services with focused query use cases where they describe a real user task; profile, session, and playbook reads now use named query use cases.
- [x] Keep Prisma selection, mapping, and transaction details inside infrastructure adapters; application code depends on ports and actions do not directly construct Prisma repositories.
- [x] Standardize error normalization and structured logging at action/application boundaries; PostgREST and duplicate-key normalization are covered, with no ad hoc `console.log` calls in use cases.
- [x] Keep composition factories as the only place where concrete infrastructure adapters are selected; actions and app routes use composition factories.

## Tests And Guardrails

- [x] Add a domain import-boundary test.
- [x] Add mapper tests for all high-value Prisma-to-DTO/domain transformations; playbook, session, profile, instructional-model, and phase-intent mapping coverage is now in place.
- [x] Add use-case tests for high-risk branches with validation, authorization, transaction coordination, or AI response handling; this now covers playbook metadata/phase writes, strategy/favorite/delete errors, session transitions, profile avatar cleanup, and AI generation planning/use cases.
- [x] Add adapter contract tests for the AI completion port; add equivalent strategy-catalog coverage when its query rules change.
- [x] Add CI checks for type checking, zero-warning lint, unit tests, and the architecture-boundary test.

## Suggested Order

1. Complete the DTO/read-model cleanup for playbooks and sessions.
2. Decouple application commands from form-schema types.
3. Add only the value objects and entity methods backed by concrete business rules.
4. Migrate or remove the remaining legacy data/service paths.
5. Increase use-case, mapper, and port contract coverage before broadening the architecture further.

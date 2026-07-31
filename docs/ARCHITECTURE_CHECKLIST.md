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
- [ ] Audit the remaining legacy `src/repositories`, `src/lib/services`, and feature `data` paths; remove or migrate each active caller.
- [ ] Decide case-by-case whether a future persistence contract is an application port (DTO/read-model oriented) or a domain repository (aggregate oriented).

## DTOs And Read Models

- [ ] Name DTOs by their use case when the shape is screen-specific: `GetSessionPageOutput`, `SessionListItemDTO`, or `PlaybookSummaryDTO`.
- [x] Rename the session list projection to `SessionListItemDTO`; retain `SessionDetailDTO` for single-session reads rather than implying a false card/detail hierarchy.
- [x] Extract `UserSummaryDTO` for repeated creator/instructor display identity across playbooks and sessions.
- [x] Keep page outputs composed from smaller DTOs; the current session page uses only `SessionDetailDTO`, so it correctly does not introduce a redundant `SessionPageDTO`.
- [x] Decouple playbook application inputs from React Hook Form and Zod input types; server actions validate and map into explicit application commands.
- [x] Decouple session create/update and profile update application inputs from form-schema types; actions validate and map boundary input into explicit commands.

## Domain Modeling

- [x] Replace the playbook entity's strategy DTO dependency with a domain `PlaybookStrategy` type.
- [ ] Add `PlaybookTitle` and `PlaybookTopic` value objects only after agreeing their shared rules: trimming, requiredness, length, and normalization.
- [ ] Make `Session` state transitions explicit and reject invalid transitions when the product rules require it.
- [ ] Use domain entities for behavior and invariants, not merely as duplicate database record shapes.
- [ ] Add aggregate methods only for rules that must be true across all entry points, such as phase ordering or duplicate strategy rules.

## Application And Infrastructure

- [ ] Replace leftover broad read services with focused query use cases where they describe a real user task.
- [ ] Keep Prisma selection, mapping, and transaction details inside infrastructure adapters.
- [ ] Standardize error normalization and structured logging at action/application boundaries; remove ad hoc `console.log` calls from use cases.
- [ ] Keep composition factories as the only place where concrete infrastructure adapters are selected.

## Tests And Guardrails

- [x] Add a domain import-boundary test.
- [ ] Add mapper tests for all high-value Prisma-to-DTO/domain transformations.
- [ ] Add use-case tests for every branch with validation, authorization, transaction coordination, or AI response handling.
- [ ] Add adapter contract tests for the AI completion and strategy-catalog ports.
- [ ] Add CI checks for type checking, unit tests, and the architecture-boundary test.

## Suggested Order

1. Complete the DTO/read-model cleanup for playbooks and sessions.
2. Decouple application commands from form-schema types.
3. Add only the value objects and entity methods backed by concrete business rules.
4. Migrate or remove the remaining legacy data/service paths.
5. Increase use-case, mapper, and port contract coverage before broadening the architecture further.

# PeerPlaybook Migration Audit

Last updated: 2026-07-08

## Purpose

PeerPlaybook is migrating from an early, Supabase-heavy implementation toward a Clean Architecture and DDD-oriented codebase. This document records migration checkpoints, decisions, and known debt so the team can continue deliberately instead of rediscovering context each time.

## Current Checkpoint

The first stabilization target was the Playbook read path. The current checkpoint now includes database-backed Playbook Phase reads, manual Playbook Phase writes, a phase-first creation/detail UI, and a first instructional-model reference-data layer for creation templates, while keeping legacy `warmup/workout/closer` strategy grouping as a compatibility bridge.

Verification:

- `npm run types:check` passes as of this checkpoint.
- `npm run lint` runs successfully as of this checkpoint, with warnings remaining from in-progress migration cleanup.

## Architectural Direction

Target feature slices should use this structure:

- `domain`: entities, value objects, repository interfaces, domain terminology
- `application`: use cases, DTOs, assemblers, application services
- `infrastructure`: Drizzle repositories, selections, mappers, external adapters
- `presentation`: React Query hooks and UI components

Business workflows should enter through server actions or application use cases. API routes should be reserved for true HTTP boundaries or integrations, not as a second internal application layer.

## Product Model Target

The product model is moving from:

```text
Playbook -> warmup / workout / closer -> copied strategy fields
```

to:

```text
Playbook -> Playbook Phases -> Strategies -> Instructions / Supplies / Notes / Resources
```

Each Playbook Phase has a user-facing title and maps internally to one learning intent:

- Activate
- Explore
- Apply
- Reflect

The phase title is user-authored. The intent provides semantic meaning, ordering defaults, strategy matching, and UI color.

## Decisions Made In This Checkpoint

1. The Playbook page DTO now models the actual page assembly input: playbook detail, strategy details, phases, and creator detail.
2. Playbook Phase reads now load `playbook_phases` joined to `phase_intents`.
3. Drizzle field-selection objects use `selections` terminology, not `projections`.
4. Manual playbook creation now creates `playbook_phases` and attaches system strategies through `playbook_phase_id`.
5. The legacy manual creation API route now delegates to the application use case instead of owning database writes directly.
6. Manual playbook creation now uses user-facing phase rows with custom titles and `Activate / Explore / Apply / Reflect` intents.
7. The Playbook detail page supports inline phase title and intent editing, persisted through an application use case and Drizzle repository.
8. The strategy list panel now accepts `PhaseIntent` for its local phase value. The drag ghost still bridges to the legacy `warmup/workout/closer` display contract.
9. The update playbook form now depends only on the fields it actually needs instead of requiring a full `PlaybookDetailDTO`.
10. The recent playbook list now accepts playbook cards without creator data and normalizes a temporary fallback display shape locally.
11. Instructional models are now modeled as reference data with template phases mapped to internal phase intents.
12. The playbook creation page now loads instructional models and can stamp phase rows from a selected template.

## Known Migration Debt

### Playbook Phases

The schema includes `playbook_phases`, and the Playbook page read path now loads those rows with intent metadata. `playbook_strategies.phase` still uses the legacy `lesson_phase` enum, and `playbook_phase_id` is optional.

Next step: migrate generation and edit flows to write `playbook_phase_id`, then retire `phase` after data migration.

### Instructional Models

Instructional models now exist as typed reference data in code, and creation phases can carry `instructionalModelId` plus `templatePhaseKey` in the request/form layer. Those values are not yet stored in PostgreSQL because the schema does not yet include `instructional_models`, `instructional_model_phases`, or references from `playbooks` / `playbook_phases`.

Next step: add the schema tables and relations once the model vocabulary is stable enough to persist.

### User-Created Strategies

The old manual creation API referenced `user_strategies`, but that table is not currently represented in the Drizzle schema or generated Supabase table types. The migrated Drizzle write path supports system strategy refs and fails explicitly for user strategy refs until this table is modeled.

Next step: decide whether user-created strategies should remain a separate table or merge into `strategies` with ownership metadata. Then add the schema/table mapping and migrate repository support.

### AI Generation

The current generation route still asks the model to choose exactly three strategies: one warmup, one workout, and one closer. This conflicts with the new phase/intent model.

Next step: introduce a candidate strategy selection service that returns ranked strategies by context, intent, mode, and size. The AI should receive curated candidates grouped by intent and return a full phase plan.

### Duplicate Application Paths

Some UI flows still use browser-side Supabase services and API routes, while newer server actions and use cases exist in parallel.

Next step: route create, generate, update, delete, and reorder behavior through application use cases. Remove old browser services after parity is reached.

### Reference Data

Phase intents and session contexts have started moving into `features/reference-data`, but the shape is incomplete. Some services return raw enums where richer DTOs will be needed for UI and strategy matching.

Next step: standardize reference-data DTOs and repositories before adding Bloom levels, templates, and strategy effectiveness metadata.

### Drizzle Configuration

`drizzle.config.ts` currently points at `./src/db/schema.ts`, while the actual exported schema lives under `./drizzle/schema.ts` and is re-exported from `src/db/client.ts`.

Next step: align Drizzle configuration before relying on new migrations.

### Cleanup

There are `.DS_Store` files under source directories. They should be removed in a housekeeping commit and ignored if not already ignored.

Lint currently reports many warnings, primarily unused imports, unused variables, and unused eslint-disable directives in partially migrated files. These should be cleaned slice-by-slice with the feature migration rather than hidden by weakening rules globally.

## Completed Migration Slice: Playbook Phase Reads

This slice completed:

1. Add read repository methods for playbook phases joined to phase intents.
2. Add `PlaybookPhaseDTO` fields for id, title, intent key, color token, objective, estimated minutes, and position.
3. Update `GetPlaybookPageUseCase` to load phases alongside playbook and strategy details.
4. Update the Playbook page to render database-backed phase titles instead of hardcoded Warmup/Workout/Closer labels.
5. Keep legacy `phase` as a compatibility fallback until existing rows are migrated.

## Completed Migration Slice: Playbook Phase Writes

This slice completed:

1. Update manual playbook creation to create `playbook_phases` first.
2. Attach selected system strategies to `playbook_phase_id`.
3. Keep writing legacy `phase` only as a compatibility field while existing UI and playfield code still require it.
4. Move API route create behavior through the application use case instead of direct route-owned database writes.

## Completed Migration Slice: Playbook Phase UI

This slice completed:

1. Replace the manual creation form's hardcoded Warmup/Workout/Closer sections with customizable phase rows.
2. Allow each phase row to select one learning intent: Activate, Explore, Apply, or Reflect.
3. Keep legacy phase values as compatibility metadata derived from the selected intent.
4. Add inline phase title and intent editing to the Playbook detail page without modals.
5. Add a phase update use case and Drizzle write repository method for persisting detail-page phase edits.

## Completed Migration Slice: Instructional Model Templates

This slice completed:

1. Add a reference-data feature for instructional models and template phases mapped to internal phase intents.
2. Thread instructional models through the playbook creation page use case and DTO.
3. Let the manual creation flow select a model template and stamp phase rows from it.
4. Keep template choice in the request/form layer without forcing premature database persistence.

## Recommended Next Migration Slice

The next slice should be instructional model persistence and phase placement parity:

1. Add `instructional_models` and `instructional_model_phases` schema tables plus references from `playbooks` and `playbook_phases`.
2. Update strategy reorder and move behavior so ordering is scoped within `playbook_phase_id`, not only the global legacy list.
3. Add focused tests around selecting a model template and creating a playbook with template-derived phases.
4. Route AI generation through the same phase model instead of exactly three legacy phases.
5. Decide and document the final user-created strategy storage model.

## Coding Standards For Migration Work

- Prefer explicit DTOs over passing database records through layers.
- Keep business decisions out of React components.
- Use Drizzle repositories for new data access.
- Use assemblers to shape page outputs.
- Do not add generic abstractions until at least two real use cases need them.
- Treat legacy fields as compatibility bridges, not as new domain language.
- Document each migration checkpoint here before moving to the next slice.

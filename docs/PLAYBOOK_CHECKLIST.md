# Playbook Checklist

## Current State

The playbook feature has moved substantially onto the Prisma/server-action path.

- `CreatePlaybookUseCase`, `GeneratePlaybookUseCase`, `UpdatePlaybookUseCase`, `UpdatePlaybookPhasesUseCase`, `UpdatePlaybookStrategyUseCase`, `DeletePlaybookUseCase`, and favorite add/remove use cases exist.
- Playbook detail and list reads are on the Prisma path through the playbook read service and page use cases.
- AI generation now has a first-class `src/features/ai` area with ports/adapters and a prompt planner.
- Generated playbooks go through the same phase-aware create flow as manual builds.
- The playbook detail page uses the migrated phase-update action.
- Update, replace-strategy, favorite, and delete flows are wired through server actions/hooks rather than the old Supabase mutation path.
- `title` is now the canonical playbook headline, `topic` is the subtitle, and create flows require both while `subject` and `courseName` remain optional.
- The playbook page now supports add/remove/replace strategy actions and phase-local reordering.
- Type-checking passes and lint passes with existing repo-wide warnings only.

## Completed

- [x] Manual create creates playbooks through Prisma.
- [x] Manual create writes `playbook_phases` and attaches strategies through `playbook_phase_id`.
- [x] Manual create handles empty phase input and missing strategy/intent validation errors.
- [x] Playbook detail reads come from `GetPlaybookPageUseCase`.
- [x] Update metadata is wired to `updatePlaybookAction`.
- [x] Delete is wired through a server action and clears cached detail/list data.
- [x] Favorite add/remove uses the migrated actions and reads saved playbook IDs from Prisma.
- [x] AI generation is routed through `GeneratePlaybookUseCase`.
- [x] AI generation uses a planner plus a JSON completion port/adapter.
- [x] AI generation writes phase-linked playbook strategies through the normal create path.
- [x] Generation validates malformed JSON, duplicate strategy slugs, duplicate phases, unknown slugs, and too few matching strategies.
- [x] The old editor route now redirects to the main playbook page.

## Still To Do

### Data Model And Ownership

- [x] `title` is the canonical playbook headline everywhere and `topic` is the subtitle.
- [x] Create flows require both `title` and `topic`.
- [x] `subject` and `courseName` are optional in create/update validation.
- [x] Add ownership enforcement for `updatePlaybookAction`.
- [x] Confirm the current user owns the playbook before mutating metadata.
- [x] Preserve permission-denied errors instead of wrapping them as unexpected failures.
- [x] Add ownership enforcement for `deletePlaybookAction`.
- [x] Confirm the current user owns the playbook before deleting.
- [x] Preserve permission-denied errors instead of wrapping them as unexpected failures.
- [x] Add ownership enforcement for `addFavoritePlaybookAction` and `removeFavoritePlaybookAction`.
- [x] Confirm the favorite request matches the current signed-in user.
- [x] Preserve permission-denied errors instead of wrapping them as unexpected failures.
- [x] Add ownership enforcement for `updatePlaybookStrategyAction` and phase update actions.
- [x] Confirm the target strategy/playbook belongs to the current user context before mutating.
- [x] Preserve permission-denied errors instead of wrapping them as unexpected failures.
- [x] Decide which ownership guarantees are handled by RLS versus the app layer, and document that contract in code.
- [x] Remove the remaining legacy `src/features/playbooks/data/playbook.repository.ts` path once nothing depends on it.

### Editing And Builder UX

- [x] Wire add-strategy from `StrategyPanel` so the playbook page can actually insert strategies into a phase.
- [x] Wire remove-strategy from the playbook page.
- [x] Ensure strategy replacement persists all fields that should carry over, not just title/steps/phase metadata.
- [x] Scope reordering explicitly by `playbook_phase_id` instead of only by the current page list order.
- [ ] Fix the strategy reorder interaction so drag-and-drop works reliably in the playbook page.
- [ ] Make strategy steps editable inline from the playbook details experience.
- [ ] Make strategy steps removable from the playbook details experience.
- [ ] Add a reset control that lets users erase their local step edits and restore the strategy to its saved/generated baseline.
- [ ] Add editable facilitator notes for each strategy.
- [ ] Show supplies in each strategy details view.
- [ ] Show the supplies objective/purpose in each strategy details view.
- [ ] Show the duration of each strategy in the strategy details view.
- [ ] Show the duration of each phase in the strategy details view.
- [ ] Make strategy duration editable and persist it through the server-action/use-case path.
- [ ] Make phase duration editable and persist it through the server-action/use-case path.
- [ ] Extend the playbook page so resources can be added to a playbook through file upload.
- [ ] Design resource uploads with future metadata needs in mind, including filename, type, size, storage key/url, owner, and attachment context.
- [ ] Model playbook edits as document-style changes that can be undone instead of one-off form mutations.
- [ ] Add an undo-ready edit history abstraction for playbook page changes so future version history can reuse the same concepts.
- [ ] Keep strategy, phase, resource, and note edits granular enough to support future version history and AI-assisted edits.
- [ ] Preserve a word-document-like editing feel on the playbook page: clear editable regions, visible saved/dirty/reset states, and changes that feel part of a document history.
- [ ] Finish phase editing if phase intent/title changes need better inline validation or feedback.
- [x] Decide whether `/editor/playbook/[id]` should remain a redirect shim or be removed entirely.

### Creation Flow

- [ ] Add playbook duration in minutes to the playbook creation form under lesson details.
- [ ] Send playbook duration in minutes from the creation form into the create/generate server actions.
- [ ] Add playbook duration in minutes to the create/generate DTOs and validation schemas.
- [ ] Pass playbook duration in minutes through `CreatePlaybookUseCase` and `GeneratePlaybookUseCase`.
- [ ] Persist playbook duration in minutes in the playbook data model and read it back on list/detail pages.
- [ ] Include playbook duration in minutes in AI generation planning so generated phase/strategy durations can fit the requested lesson length.

### AI Expansion

- [ ] Add a structured way to inject new instructional guidance into AI planning, such as Bloom’s taxonomy, lesson level, or app-specific constraints.
- [ ] Add a real AI context catalog instead of keeping guidance only in code constants.
- [ ] Expand AI error handling for provider outages, rate limits, and empty completions with user-facing retry guidance.
- [ ] Add tests around the planner and the OpenAI adapter boundary.
- [ ] Consider whether generation should return and store a rationale per chosen strategy for review/debugging.

### Error And Edge Cases

- [ ] Restore or polish empty-state handling for playbooks with no phases or no strategies on the detail page.
- [ ] Make sure deleted/not-found playbooks produce a consistent page and metadata failure state.
- [ ] Reduce swallowed errors in save flows so users can see when phase or strategy saves fail.
- [ ] Audit remaining console logging in playbook actions and use cases.

### Tests

- [ ] Unit test `CreatePlaybookUseCase` phase creation and missing-strategy validation.
- [ ] Unit test `GeneratePlaybookUseCase` with the AI planner mocked.
- [x] Add repository or integration tests for saved playbooks, delete cascade, phase updates, and strategy updates.
- [x] Add ownership/security tests for update, delete, favorite add/remove, and strategy update actions.
  - [x] Verify the ownership helper rejects a user who does not own the target playbook or strategy.
  - [x] Verify the happy path still succeeds for the owning user.
  - [x] Keep the action guard behavior consistent with DB/RLS failures by surfacing permission-denied errors directly.
- [x] Add interaction coverage for create, generate, update, delete, and favorite flows.
- [ ] Add regression coverage for AI prompt/context expansion.
- [x] Add unit coverage for add/remove/replacement strategy use cases.

## Priority Order

1. Finish the builder/editing path on the playbook page, especially broken strategy reordering, editable/removable/resettable steps, facilitator notes, resource uploads, and editable durations.
2. Add playbook duration to creation/generation from the lesson details form through server actions, use cases, persistence, and AI planning.
3. Introduce the document-style edit/history abstraction needed for undo now and version history or AI-assisted edits later.
4. Add the AI context-extensibility layer so new instructional frameworks can be plugged in without rewiring generation.
5. Add tests around the new server-action and planner boundaries.
6. Remove the remaining legacy playbook repository path after confirming no callers depend on it.

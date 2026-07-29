# Contributing To PeerPlaybook

Thanks for contributing. This guide is meant to help a new collaborator get productive without having to rediscover the current architecture and workflow.

## Development Baseline

- Use Node.js 20 or newer
- Use `npm` with the committed `package-lock.json`
- Base new work on the `development` branch
- Keep local secrets in `.env.local` only

## Getting Started

1. Install dependencies:

```bash
npm ci
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

3. Fill in the required Supabase and database values.

4. Start the app:

```bash
npm run dev
```

## Branching And Commit Style

- Open feature work from `development`
- Keep branches focused and short-lived
- Prefer conventional commit messages

Commit format:

```text
type(scope): imperative summary
```

Examples:

- `feat(playbook): add strategy replacement flow`
- `fix(auth): guard onboarding redirect when profile is missing`
- `docs(onboarding): improve collaborator documentation`

## Pull Request Expectations

Before opening a PR, run:

```bash
npm run types:check
npm run lint
npm run test:unit
```

Repository caveats to keep in mind:

- `test:e2e` is configured, but a committed `e2e/` suite is not currently present
- `test:integration` currently runs the same command as `test:unit`
- CI is not yet committed in this repository, so local verification matters

## Architecture Conventions

The intended application path is:

```text
UI or route
  -> server action
  -> composition factory
  -> use case
  -> repository or adapter
  -> DTO
```

Prefer this structure when adding or refactoring behavior:

- `domain`: business concepts, repository contracts, stable terminology
- `application`: use cases, DTOs, orchestration, assemblers
- `infrastructure`: Prisma repositories, static catalogs, provider adapters
- `presentation`: React hooks and UI components

Avoid putting business rules directly in React components when the rule can live in a use case or selector.

## Data Access Rules

The codebase currently uses both Prisma and Supabase.

- Use Prisma for migrated server-side data access and writes
- Use Supabase for auth, cookie-backed session handling, storage, and legacy repository paths that have not been migrated yet
- Do not assume both paths expose the same table shapes or naming conventions

When touching a data flow, verify which path it currently uses before extending it.

## Playbook Domain Notes

The playbook feature is mid-migration from the older `warmup/workout/closer` model to a `playbook_phases` model with intent keys:

- `activate`
- `explore`
- `apply`
- `reflect`

Some strategies still persist legacy phase values as a compatibility bridge. When working in this area:

- preserve existing fallback behavior unless the change explicitly completes a migration slice
- prefer phase IDs and intent keys where the newer model already exists
- document any compatibility assumptions in code when they are not obvious

## UI And Client-Side State

- Shared UI lives in `src/components`
- Feature-specific UI belongs in `src/features/<feature>/presentation`
- TanStack Query caches server data
- Workspace-style editors often keep local draft state separate from persisted state

If you change optimistic updates or draft state, verify both the cache behavior and the save/reset lifecycle.

## Validation And Errors

- Prefer Zod schemas under `src/lib/validation`
- Server actions should return serializable action results
- Client hooks typically unwrap action results and throw normalized errors

Keep error messages actionable for the user and specific enough for debugging.

## Generated Files

Do not hand-edit generated output:

- `src/generated/prisma/`
- Supabase-generated database type files under `src/types/`

When schema-related work changes generated output, include both the source change and the regenerated artifacts in the same PR when appropriate.

## Database And Type Generation

Prisma:

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Client output: `src/generated/prisma/`

Supabase type generation:

```bash
npm run gen:db
```

Notes:

- This script requires Supabase CLI access
- It overwrites generated type files
- It should only be run when the underlying schema actually changes

## Formatting And Linting

- Use the existing ESLint setup via `npm run lint`
- Keep comments concise and intent-focused
- Clean up warnings in files you touch when practical, especially unused imports or stale code paths

## Documentation To Update With Code

If your change affects onboarding, architecture, or migration assumptions, update the relevant docs in the same PR:

- `README.md`
- `CONTRIBUTING.md`
- `docs/ARCHITECTURE.md`
- `docs/MIGRATION_AUDIT.md`
- `docs/PLAYBOOK_CHECKLIST.md`

## When In Doubt

If a flow looks duplicated, check whether you are seeing:

- an older Supabase-first path
- a newer server-action plus Prisma path
- a temporary compatibility layer during migration

Document the boundary you are relying on instead of silently extending both paths.

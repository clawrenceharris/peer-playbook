# PeerPlaybook

PeerPlaybook is a planning tool for Supplemental Instruction leaders. It helps facilitators build playbooks, organize phases and strategies, and prepare sessions for student-led peer learning.

## What To Read First

- `README.md`: local setup, scripts, and repository map
- `CONTRIBUTING.md`: workflow, commit style, and development conventions
- `docs/ARCHITECTURE.md`: application boundaries, data flow, and migration context
- `docs/MIGRATION_AUDIT.md`: current migration checkpoint and technical debt
- `docs/PLAYBOOK_CHECKLIST.md`: playbook-specific feature status

## Stack

- Next.js 16 App Router with React 19
- TypeScript, Tailwind CSS 4, and shadcn-style UI components
- Supabase for auth, cookies, storage, and some legacy repository paths
- Prisma 7 with PostgreSQL for current server-side data access
- TanStack Query for client caching and optimistic updates
- OpenAI for playbook generation
- Stream Video for virtual-session capabilities
- Vitest for unit tests and Playwright for E2E scaffolding

## Quick Start

1. Install dependencies:

```bash
npm ci
```

2. Create a local env file from the template:

```bash
cp .env.example .env.local
```

3. Fill in the required values in `.env.local`.

4. Start the app:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## Required Environment

Minimum local setup:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `DATABASE_URL`

Common optional integrations:

- `NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET`
- `NEXT_PUBLIC_SITE_URL`
- `OPENAI_API_KEY`
- `OPENAI_PROJECT_ID`
- `OPENAI_PLAYBOOK_MODEL`
- `NEXT_PUBLIC_STREAM_VIDEO_API_KEY`
- `STREAM_VIDEO_API_SECRET`
- `NEXT_PUBLIC_SENTRY_DSN`

See `.env.example` for the full list of supported variables and placeholder values.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server with Turbopack |
| `npm run build` | Build the production app |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run types:check` | Run TypeScript without emitting files |
| `npm run test` | Start Vitest in watch mode |
| `npm run test:unit` | Run Vitest once |
| `npm run test:integration` | Currently the same as `test:unit` |
| `npm run test:e2e` | Run Playwright tests |
| `npm run gen:db` | Regenerate Supabase TypeScript types |

## Repository Map

```text
src/
  app/           Next.js routes, layouts, and API endpoints
  actions/       Server actions that validate input and call use cases
  composition/   Dependency wiring for application services and repositories
  features/      Feature slices with domain/application/infrastructure/presentation layers
  components/    Shared UI and providers
  lib/           Cross-cutting infrastructure (db, supabase, validation, queries)
  shared/        Shared result types, action helpers, and error utilities
  generated/     Generated Prisma client output
prisma/          Schema and migrations
docs/            Internal product and migration documentation
```

## Architecture At A Glance

Most product flows now follow this path:

```text
React page or hook
  -> server action
  -> composition factory
  -> use case
  -> Prisma repository
  -> DTO returned to UI
```

Important current boundary:

- Supabase still owns authentication, cookies, storage, and some legacy repository paths
- Prisma is the primary server-side write and read path for migrated playbook, profile, and session flows

The codebase is mid-migration, so both systems appear in the repository. `docs/ARCHITECTURE.md` explains where each one belongs today.

## Branching And Commits

- Base new work on `development`
- Use conventional commit messages in the form `type(scope): message`
- For this repository, a good example is `feat(playbook): add phase-level validation`

More guidance lives in `CONTRIBUTING.md`.

## Testing Notes

Before opening a PR, run:

```bash
npm run types:check
npm run lint
npm run test:unit
```

Current limitations:

- E2E scaffolding exists, but the repository does not currently include a committed `e2e/` suite
- Some repository areas are still being migrated, so documentation and behavior should be validated against code when touching older paths

## Deployment

The app is intended for Vercel deployment. Ensure the same required environment variables are configured in the deployment target before shipping changes.

## Additional References

- [Next.js documentation](https://nextjs.org/docs)
- [Prisma documentation](https://www.prisma.io/docs)
- [Supabase documentation](https://supabase.com/docs)

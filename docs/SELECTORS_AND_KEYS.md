# Selectors and Query Key Factories

This document explains how to use the Redux-style selectors and React Query key factories implemented across the Sessions, Playbooks, and Strategies domains.

## Overview

The codebase now follows a consistent pattern inspired by Redux selectors and React Query best practices:

1. **Selectors**: Pure functions that transform and filter data
2. **Query Key Factories**: Centralized key management for React Query
3. **Generic Hooks**: Type-safe hooks that accept selector functions

## Query Key Factories

Query key factories provide a centralized, type-safe way to manage React Query cache keys. They follow the [official React Query recommendation](https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories).

### Sessions Keys

```typescript
import { sessionKeys } from "@/features/sessions/keys";

// Usage examples:
sessionKeys.all; // ['sessions']
sessionKeys.lists(); // ['sessions', 'list']
sessionKeys.list({ status: "active" }); // ['sessions', 'list', { filters: { status: 'active' }}]
sessionKeys.detail("session-id"); // ['sessions', 'detail', 'session-id']
sessionKeys.byLeader("user-id"); // ['sessions', 'leader', 'user-id']
sessionKeys.byStatus("completed"); // ['sessions', 'status', 'completed']
```

### Playbooks Keys

```typescript
import { playbookKeys } from "@/features/playbooks/keys";

// Usage examples:
playbookKeys.all; // ['playbooks']
playbookKeys.lists(); // ['playbooks', 'list']
playbookKeys.detail("playbook-id"); // ['playbooks', 'detail', 'playbook-id']
playbookKeys.byUser("user-id"); // ['playbooks', 'user', 'user-id']
```

### Strategies Keys

```typescript
import { strategyKeys } from "@/features/strategies/keys";

// Usage examples:
strategyKeys.all; // ['strategies']
strategyKeys.lists(); // ['strategies', 'list']
strategyKeys.detail("strategy-id"); // ['strategies', 'detail', 'strategy-id']
strategyKeys.byCategory("category"); // ['strategies', 'category', 'category']
strategyKeys.saved("user-id"); // ['strategies', 'saved', 'user-id']
```

## Selectors

Selectors are pure functions that transform data. They can be composed together for powerful data transformations.

### Basic Selector Usage

```typescript
import { useSessions } from "@/features/sessions/hooks";
import {
  selectActiveSessions,
  selectSortedSessions,
} from "@/features/sessions/selectors";

// Use a single selector
const { data: sessions } = useSessions(selectActiveSessions);

// Chain selectors manually
const { data: sortedActive } = useSessions((sessions) =>
  selectSortedSessions(selectActiveSessions(sessions))
);
```

### Composing Selectors

Use the `pipe` or `compose` utilities to chain multiple selectors:

```typescript
import {
  selectActiveSessions,
  selectSortedSessions,
  selectFirstN,
  pipe,
} from "@/features/sessions/selectors";

// Pipe (left to right)
const selectTop5Active = pipe(
  selectActiveSessions,
  selectSortedSessions,
  selectFirstN(5)
);

const { data } = useSessions(selectTop5Active);
```

### Sessions Selectors

#### Sorting

- `selectSortedSessions(sessions)` - Sort by creation date (newest first)
- `selectSortedByUpdated(sessions)` - Sort by update date
- `selectSortedByTopic(sessions)` - Sort alphabetically by topic

#### Filtering

- `selectSessionsByLeader(leaderId)(sessions)` - Filter by leader
- `selectSessionsByStatus(status)(sessions)` - Filter by status
- `selectSessionsByCourse(courseName)(sessions)` - Filter by course
- `selectActiveSessions(sessions)` - Only active sessions
- `selectCompletedSessions(sessions)` - Only completed sessions
- `selectVirtualSessions(sessions)` - Only virtual sessions
- `selectInPersonSessions(sessions)` - Only in-person sessions

#### Transformations

- `selectSessionIds(sessions)` - Extract IDs
- `selectUniqueCourses(sessions)` - Get unique course names
- `selectSessionsByStatusGroup(sessions)` - Group by status
- `selectSessionsByLeaderGroup(sessions)` - Group by leader

#### Pagination

- `selectFirstN(n)(sessions)` - Take first N sessions
- `selectRecentSessions(n)(sessions)` - Get N most recent

### Playbooks Selectors

#### Sorting

- `selectSortedPlaybooks(playbooks)` - Sort by creation date
- `selectSortedByUpdated(playbooks)` - Sort by update date
- `selectSortedByTopic(playbooks)` - Sort by topic
- `selectSortedByCourse(playbooks)` - Sort by course

#### Filtering

- `selectMyPlaybooks(userId)(playbooks)` - User's playbooks
- `selectOthersPlaybooks(userId)(playbooks)` - Other users' playbooks
- `selectPublishedPlaybooks(playbooks)` - Published only
- `selectDraftPlaybooks(playbooks)` - Drafts only
- `selectMyFavoritePlaybooks(userId)(playbooks)` - User's favorites
- `selectMyPublishedPlaybooks(userId)(playbooks)` - User's published
- `selectMyDraftPlaybooks(userId)(playbooks)` - User's drafts
- `selectPlaybooksByCourse(courseName)(playbooks)` - By course
- `selectPlaybooksByTopic(topic)(playbooks)` - By topic (partial match)

#### Playbook Strategies

- `selectSortedStrategies(strategies)` - Sort by phase (warmup → workout → closer)
- `selectStrategiesByPhase(phase)(strategies)` - Filter by phase
- `selectStrategiesByCategory(category)(strategies)` - Filter by category
- `selectCustomStrategies(strategies)` - Custom strategies only
- `selectBaseStrategies(strategies)` - Base strategies only

#### Transformations

- `selectPlaybookIds(playbooks)` - Extract IDs
- `selectUniqueCourses(playbooks)` - Get unique courses
- `selectUniqueTopics(playbooks)` - Get unique topics
- `selectPlaybooksByOwnerGroup(playbooks)` - Group by owner
- `selectPlaybooksByCourseGroup(playbooks)` - Group by course

#### Pagination

- `selectFirstN(n)(playbooks)` - Take first N
- `selectRecentPlaybooks(n)(playbooks)` - Get N most recent

### Strategies Selectors

#### Sorting

- `selectSortedStrategies(strategies)` - Sort by creation date
- `selectSortedByTitle(strategies)` - Sort by title
- `selectSortedByCategory(strategies)` - Sort by category

#### Filtering

- `selectMyStrategies(userId)(strategies)` - User's strategies
- `selectOthersStrategies(userId)(strategies)` - Others' strategies
- `selectPublishedStrategies(strategies)` - Published only
- `selectDraftStrategies(strategies)` - Drafts only
- `selectSystemStrategies(strategies)` - System strategies
- `selectCustomStrategies(strategies)` - Custom strategies
- `selectMyPublishedStrategies(userId)(strategies)` - User's published
- `selectMyDraftStrategies(userId)(strategies)` - User's drafts
- `selectStrategiesByCategory(category)(strategies)` - By category
- `selectStrategiesByCourseTag(tag)(strategies)` - By course tag
- `selectStrategiesByAllTags(tags)(strategies)` - Has all tags
- `selectStrategiesByAnyTag(tags)(strategies)` - Has any tag
- `selectStrategiesBySearch(term)(strategies)` - Full-text search

#### Transformations

- `selectStrategyIds(strategies)` - Extract IDs
- `selectUniqueCategories(strategies)` - Get unique categories
- `selectUniqueTags(strategies)` - Get all unique tags
- `selectStrategiesByCategoryGroup(strategies)` - Group by category
- `selectStrategiesByCreatorGroup(strategies)` - Group by creator
- `selectStrategyMap(strategies)` - Create ID → Strategy map

#### Saved Strategies

- `selectSavedStrategiesFromIds(savedIds)(strategies)` - Filter by saved IDs
- `selectUnsavedStrategies(savedIds)(strategies)` - Exclude saved IDs

#### Pagination

- `selectFirstN(n)(strategies)` - Take first N
- `selectRecentStrategies(n)(strategies)` - Get N most recent

## Hooks with Generic Typing

All base hooks now support generic typing, allowing selectors to return any type:

```typescript
// Returns Sessions[]
const { data: sessions } = useSessions();

// Returns string[] (using selectSessionIds)
const { data: ids } = useSessions(selectSessionIds);

// Returns Record<string, Sessions[]> (using selectSessionsByStatusGroup)
const { data: grouped } = useSessions(selectSessionsByStatusGroup);

// Returns number (custom selector)
const { data: count } = useSessions((sessions) => sessions.length);
```

### Pre-built Convenience Hooks

Many common use cases have dedicated hooks:

#### Sessions

- `useSessions(selector?)` - Base hook
- `useSortedSessions(selector?)` - Pre-sorted by date
- `useActiveSessions(selector?)` - Active sessions only
- `useCompletedSessions(selector?)` - Completed sessions only
- `useRecentSessions(count?)` - Recent N sessions
- `useMySessions(userId, selector?)` - User's sessions

#### Playbooks

- `usePlaybooks(selector?)` - Base hook
- `useSortedPlaybooks(selector?)` - Pre-sorted by date
- `usePublishedPlaybooks(selector?)` - Published only
- `useRecentPlaybooks(count?)` - Recent N playbooks
- `useUserPlaybooks(userId, selector?)` - User's playbooks
- `useMyFavoritePlaybooks(userId)` - User's favorites
- `useMyPublishedPlaybooks(userId)` - User's published
- `useMyDraftPlaybooks(userId)` - User's drafts
- `usePlaybookStrategies(playbookId, selector?)` - Playbook strategies
- `useSortedPlaybookStrategies(playbookId)` - Sorted by phase

#### Strategies

- `useStrategies(selector?)` - Base hook
- `useSortedStrategies(selector?)` - Pre-sorted by date
- `usePublishedStrategies(selector?)` - Published only
- `useSystemStrategies(selector?)` - System strategies only
- `useRecentStrategies(count?)` - Recent N strategies
- `useMySavedStrategies(userId, selector?)` - User's saved strategy IDs
- `useMySavedStrategiesWithDetails(userId)` - Full strategy objects for saved

## Advanced Examples

### Example 1: Active Sessions for a Specific Course

```typescript
import { useSessions } from "@/features/sessions/hooks";
import {
  selectActiveSessions,
  selectSessionsByCourse,
  pipe,
} from "@/features/sessions/selectors";

function CourseActiveSessions({ courseName }: { courseName: string }) {
  const { data: sessions } = useSessions(
    pipe(selectActiveSessions, selectSessionsByCourse(courseName))
  );

  return <div>{sessions?.length} active sessions</div>;
}
```

### Example 2: Top 5 Recent Published Playbooks

```typescript
import { usePlaybooks } from "@/features/playbooks/hooks";
import {
  selectPublishedPlaybooks,
  selectSortedPlaybooks,
  selectFirstN,
  pipe,
} from "@/features/playbooks/selectors";

function RecentPublished() {
  const { data: playbooks } = usePlaybooks(
    pipe(selectPublishedPlaybooks, selectSortedPlaybooks, selectFirstN(5))
  );

  return (
    <ul>
      {playbooks?.map((p) => (
        <li key={p.id}>{p.topic}</li>
      ))}
    </ul>
  );
}
```

### Example 3: Strategy Search with Multiple Tags

```typescript
import { useStrategies } from "@/features/strategies/hooks";
import {
  selectPublishedStrategies,
  selectStrategiesByAllTags,
  selectSortedByTitle,
  pipe,
} from "@/features/strategies/selectors";

function StrategiesByTags({ tags }: { tags: string[] }) {
  const { data: strategies } = useStrategies(
    pipe(
      selectPublishedStrategies,
      selectStrategiesByAllTags(tags),
      selectSortedByTitle
    )
  );

  return <div>{strategies?.length} matching strategies</div>;
}
```

### Example 4: Custom Selector for Derived Data

```typescript
import { usePlaybooks } from "@/features/playbooks/hooks";
import { selectMyPublishedPlaybooks } from "@/features/playbooks/selectors";

function MyPublishedStats({ userId }: { userId: string }) {
  // Custom selector that returns derived data
  const { data: stats } = usePlaybooks((playbooks) => {
    const myPublished = selectMyPublishedPlaybooks(userId)(playbooks);
    return {
      count: myPublished.length,
      courses: [...new Set(myPublished.map((p) => p.course_name))],
      latest: myPublished[0],
    };
  });

  return (
    <div>
      Published {stats?.count} across {stats?.courses.length} courses
    </div>
  );
}
```

## Benefits

1. **Type Safety**: Generic hooks preserve type information through transformations
2. **Reusability**: Selectors are pure functions that can be reused across components
3. **Composability**: Chain selectors using `pipe` or `compose` utilities
4. **Performance**: React Query handles memoization; selectors are only re-run when data changes
5. **Testability**: Pure selector functions are easy to unit test
6. **Maintainability**: Centralized logic for data transformations and query keys
7. **Cache Management**: Key factories make invalidation and prefetching straightforward

## Testing Selectors

Selectors are pure functions, making them easy to test:

```typescript
import {
  selectActiveSessions,
  selectSessionIds,
} from "@/features/sessions/selectors";

describe("Session Selectors", () => {
  it("filters active sessions", () => {
    const sessions = [
      { id: "1", status: "active" },
      { id: "2", status: "completed" },
      { id: "3", status: "active" },
    ];

    const result = selectActiveSessions(sessions);
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.status === "active")).toBe(true);
  });

  it("extracts session IDs", () => {
    const sessions = [
      { id: "1", name: "A" },
      { id: "2", name: "B" },
    ];

    const result = selectSessionIds(sessions);
    expect(result).toEqual(["1", "2"]);
  });
});
```

## Migration Guide

If you have existing hooks that inline filter logic, migrate to selectors:

**Before:**

```typescript
const { data: sessions } = useSessions();
const activeSessions = sessions?.filter((s) => s.status === "active");
```

**After:**

```typescript
import { selectActiveSessions } from "@/features/sessions/selectors";
const { data: activeSessions } = useSessions(selectActiveSessions);
```

This moves the filtering into the React Query select function, which is more efficient and leverages React Query's memoization.

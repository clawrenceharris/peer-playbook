# Quick Usage Examples

This document provides quick copy-paste examples for common patterns using the new selector and query key factory system.

## Basic Usage

### 1. Simple Data Fetching

```typescript
import { useSessions } from "@/features/sessions/hooks";

function SessionList() {
  const { data: sessions, isLoading } = useSessions();

  if (isLoading) return <div>Loading...</div>;
  return <div>{sessions?.length} sessions</div>;
}
```

### 2. Using Pre-built Hooks

```typescript
import { useActiveSessions } from "@/features/sessions/hooks";

function ActiveSessionList() {
  // Automatically filters to active sessions
  const { data: sessions } = useActiveSessions();
  return (
    <ul>
      {sessions?.map((s) => (
        <li key={s.id}>{s.topic}</li>
      ))}
    </ul>
  );
}
```

### 3. Applying a Selector

```typescript
import { useSessions } from "@/features/sessions/hooks";
import { selectVirtualSessions } from "@/features/sessions/selectors";

function VirtualSessionList() {
  const { data: sessions } = useSessions(selectVirtualSessions);
  return <div>{sessions?.length} virtual sessions</div>;
}
```

## Chaining Selectors

### 4. Using Pipe for Multiple Transformations

```typescript
import { useSessions } from "@/features/sessions/hooks";
import {
  selectActiveSessions,
  selectVirtualSessions,
  selectSortedSessions,
  pipe,
} from "@/features/sessions/selectors";

function ActiveVirtualSessions() {
  const { data: sessions } = useSessions(
    pipe(selectActiveSessions, selectVirtualSessions, selectSortedSessions)
  );

  return (
    <ul>
      {sessions?.map((s) => (
        <li key={s.id}>{s.topic}</li>
      ))}
    </ul>
  );
}
```

### 5. Filtering with Parameters

```typescript
import { usePlaybooks } from "@/features/playbooks/hooks";
import {
  selectPublishedPlaybooks,
  selectPlaybooksByCourse,
  pipe,
} from "@/features/playbooks/selectors";

function CoursePlaybooks({ courseName }: { courseName: string }) {
  const { data: playbooks } = usePlaybooks(
    pipe(selectPublishedPlaybooks, selectPlaybooksByCourse(courseName))
  );

  return (
    <div>
      {playbooks?.length} playbooks for {courseName}
    </div>
  );
}
```

## User-Specific Data

### 6. User's Favorite Playbooks

```typescript
import { useMyFavoritePlaybooks } from "@/features/playbooks/hooks";
import { useUser } from "@/app/providers";

function MyFavorites() {
  const { user } = useUser();
  const { data: favorites } = useMyFavoritePlaybooks(user.id);

  return <div>You have {favorites?.length} favorite playbooks</div>;
}
```

### 7. User's Sessions with Additional Filtering

```typescript
import { selectCompletedSessions } from "@/features/sessions/selectors";
import { useUser } from "@/app/providers";

function MyCompletedSessions() {
  const { user } = useUser();
  const { data: sessions } = useMySessions(user.id, selectCompletedSessions);

  return <div>Completed {sessions?.length} sessions</div>;
}
```

## Transforming Data

### 8. Extracting IDs

```typescript
import { useSessions } from "@/features/sessions/hooks";
import { selectSessionIds } from "@/features/sessions/selectors";

function SessionIdList() {
  const { data: ids } = useSessions(selectSessionIds);

  return <div>IDs: {ids?.join(", ")}</div>;
}
```

### 9. Grouping Data

```typescript
import { useSessions } from "@/features/sessions/hooks";
import { selectSessionsByStatusGroup } from "@/features/sessions/selectors";

function SessionsByStatus() {
  const { data: grouped } = useSessions(selectSessionsByStatusGroup);

  return (
    <div>
      {Object.entries(grouped || {}).map(([status, sessions]) => (
        <div key={status}>
          <h3>
            {status}: {sessions.length}
          </h3>
        </div>
      ))}
    </div>
  );
}
```

### 10. Custom Transformation

```typescript
import { usePlaybooks } from "@/features/playbooks/hooks";
import { selectMyPublishedPlaybooks } from "@/features/playbooks/selectors";
import { useUser } from "@/app/providers";

function MyPlaybookStats() {
  const { user } = useUser();

  // Custom selector that returns derived statistics
  const { data: stats } = usePlaybooks((playbooks) => {
    const myPublished = selectMyPublishedPlaybooks(user.id)(playbooks);

    return {
      total: myPublished.length,
      courses: [...new Set(myPublished.map((p) => p.course_name))],
      topics: [...new Set(myPublished.map((p) => p.topic))],
      mostRecent: myPublished.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      )[0],
    };
  });

  return (
    <div>
      <p>Published: {stats?.total}</p>
      <p>Across: {stats?.courses.length} courses</p>
      <p>Topics: {stats?.topics.length}</p>
    </div>
  );
}
```

## Pagination & Limiting

### 11. Recent N Items

```typescript
import { useRecentSessions } from "@/features/sessions/hooks";

function RecentSessions() {
  // Get 5 most recent sessions
  const { data: sessions } = useRecentSessions(5);

  return (
    <ul>
      {sessions?.map((s) => (
        <li key={s.id}>{s.topic}</li>
      ))}
    </ul>
  );
}
```

### 12. Custom Pagination

```typescript
import { usePlaybooks } from "@/features/playbooks/hooks";
import {
  selectSortedPlaybooks,
  selectFirstN,
  pipe,
} from "@/features/playbooks/selectors";

function TopPlaybooks({ count }: { count: number }) {
  const { data: playbooks } = usePlaybooks(
    pipe(selectSortedPlaybooks, selectFirstN(count))
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

## Search & Filtering

### 13. Multi-Tag Strategy Search

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

  return <div>Found {strategies?.length} strategies with all tags</div>;
}
```

### 14. Full-Text Strategy Search

```typescript
import { useStrategies } from "@/features/strategies/hooks";
import { selectStrategiesBySearch } from "@/features/strategies/selectors";
import { useState } from "react";

function StrategySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: strategies } = useStrategies(
    selectStrategiesBySearch(searchTerm)
  );

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search strategies..."
      />
      <p>Found {strategies?.length} results</p>
    </div>
  );
}
```

## Advanced Patterns

### 15. Combining Multiple Data Sources

```typescript
import { useSessions } from "@/features/sessions/hooks";
import { usePlaybooks } from "@/features/playbooks/hooks";
import { useUser } from "@/app/providers";
import { selectMyPlaybooks } from "@/features/playbooks/selectors";

function MyPlaybooksWithSessionCounts() {
  const { user } = useUser();
  const { data: playbooks } = usePlaybooks(selectMyPlaybooks(user.id));
  const { data: sessions } = useSessions();

  const playbooksWithCounts = playbooks?.map((playbook) => ({
    ...playbook,
    sessionCount:
      sessions?.filter((s) => s.playbook_id === playbook.id).length || 0,
  }));

  return (
    <ul>
      {playbooksWithCounts?.map((p) => (
        <li key={p.id}>
          {p.topic} ({p.sessionCount} sessions)
        </li>
      ))}
    </ul>
  );
}
```

### 16. Conditional Selectors

```typescript
import { usePlaybooks } from "@/features/playbooks/hooks";
import {
  selectPublishedPlaybooks,
  selectDraftPlaybooks,
} from "@/features/playbooks/selectors";

function PlaybookList({ showPublished }: { showPublished: boolean }) {
  const { data: playbooks } = usePlaybooks(
    showPublished ? selectPublishedPlaybooks : selectDraftPlaybooks
  );

  return (
    <div>
      {playbooks?.length} {showPublished ? "published" : "draft"} playbooks
    </div>
  );
}
```

### 17. Saved Strategies with Full Details

```typescript
import { useMySavedStrategiesWithDetails } from "@/features/strategies/hooks";
import { useUser } from "@/app/providers";
import { selectSortedByTitle } from "@/features/strategies/selectors";

function MySavedStrategies() {
  const { user } = useUser();
  // This hook combines saved IDs with full strategy data
  const { data: strategies } = useMySavedStrategiesWithDetails(user.id);

  // Can still apply additional selectors
  const sorted = strategies ? selectSortedByTitle(strategies) : [];

  return (
    <ul>
      {sorted.map((s) => (
        <li key={s.id}>{s.title}</li>
      ))}
    </ul>
  );
}
```

## Using Query Keys for Cache Management

### 18. Invalidating Specific Queries

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionKeys } from "@/features/sessions/keys";

function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSession) => createSession(newSession),
    onSuccess: () => {
      // Invalidate all session lists
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}
```

### 19. Prefetching Data

```typescript
import { useQueryClient } from "@tanstack/react-query";
import { playbookKeys } from "@/features/playbooks/keys";
import { usePlaybookService } from "@/features/playbooks/hooks";

function PlaybookListItem({ playbookId }: { playbookId: string }) {
  const queryClient = useQueryClient();
  const { playbookService } = usePlaybookService();

  const handleMouseEnter = () => {
    // Prefetch playbook details on hover
    queryClient.prefetchQuery({
      queryKey: playbookKeys.detail(playbookId),
      queryFn: () => playbookService.getById(playbookId),
    });
  };

  return <div onMouseEnter={handleMouseEnter}>Playbook {playbookId}</div>;
}
```

### 20. Optimistic Updates

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playbookKeys } from "@/features/playbooks/keys";
import { Playbooks } from "@/types";

function useToggleFavorite(playbookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isFavorite: boolean) =>
      updatePlaybook(playbookId, { favorite: isFavorite }),

    onMutate: async (isFavorite) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: playbookKeys.lists() });

      // Snapshot previous value
      const previous = queryClient.getQueryData<Playbooks[]>(
        playbookKeys.lists()
      );

      // Optimistically update
      queryClient.setQueryData<Playbooks[]>(playbookKeys.lists(), (old) =>
        old?.map((p) =>
          p.id === playbookId ? { ...p, favorite: isFavorite } : p
        )
      );

      return { previous };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(playbookKeys.lists(), context.previous);
      }
    },

    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: playbookKeys.lists() });
    },
  });
}
```

## Performance Tips

### 21. Memoizing Complex Selectors

```typescript
import { useSessions } from "@/features/sessions/hooks";
import { useMemo } from "react";
import {
  selectActiveSessions,
  selectSessionsByCourse,
  pipe,
} from "@/features/sessions/selectors";

function CourseActiveSessions({ courseName }: { courseName: string }) {
  // Memoize the selector function so it doesn't change on every render
  const selector = useMemo(
    () => pipe(selectActiveSessions, selectSessionsByCourse(courseName)),
    [courseName]
  );

  const { data: sessions } = useSessions(selector);

  return <div>{sessions?.length} active sessions</div>;
}
```

### 22. Avoiding Over-Fetching

```typescript
import { usePlaybook } from "@/features/playbooks/hooks";
import { useSortedPlaybookStrategies } from "@/features/playbooks/hooks";

function PlaybookDetail({ playbookId }: { playbookId: string }) {
  // Only fetch what you need
  const { data: playbook } = usePlaybook(playbookId);
  const { data: strategies } = useSortedPlaybookStrategies(playbookId);

  // Both queries use separate keys, allowing independent caching
  return (
    <div>
      <h1>{playbook?.topic}</h1>
      <ul>
        {strategies?.map((s) => (
          <li key={s.id}>{s.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## TypeScript Tips

### 23. Type-Safe Custom Selectors

```typescript
import { useSessions } from "@/features/sessions/hooks";
import { Sessions } from "@/types";

interface SessionSummary {
  total: number;
  byStatus: Record<string, number>;
}

function SessionStats() {
  // TypeScript infers return type from selector
  const { data } = useSessions(
    (sessions: Sessions[]): SessionSummary => ({
      total: sessions.length,
      byStatus: sessions.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    })
  );

  return <div>Total: {data?.total}</div>;
}
```

This document should give you everything you need to get started with the new selector and query key system!

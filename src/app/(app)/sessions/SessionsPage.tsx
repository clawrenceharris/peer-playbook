"use client";
import { PlaybookFilters } from "@/features/playbooks/presentation/components";
import { EmptyState } from "@/components/states";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/use-search";
import { useCallback, useMemo } from "react";
import { ContentLayout } from "@/components/sidebar";
import { SearchInput } from "@/components/form";
import { useSessionFilters } from "@/features/sessions/hooks";
import { SessionListItemDTO } from "@/features/sessions/application/dto";
import { SessionList } from "@/features/sessions/components/ui/session-list";
import { useUserSessions } from "@/features/sessions/hooks/use-user-sessions";
import { useUser } from "@/components/providers";

export default function SessionsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { data = [] } = useUserSessions(user.id);
  const { filters, setFilters, filteredSessions, availableCourses } =
    useSessionFilters(data);

  const filterSessions = useCallback(
    (item: SessionListItemDTO, query: string): boolean => {
      const q = query.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.topic?.toLowerCase().includes(q) ||
        item.courseName?.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q) ||
        false
      );
    },
    [],
  );

  const { query, search, clearResults } = useSearch<SessionListItemDTO>({
    data,
    filter: filterSessions,
    minQueryLength: 1,
    debounceMs: 0,
  });

  const hasQuery = query.trim().length > 0;
  const hasActiveFilters = Boolean(filters.course || filters.timeRange);

  const sessions = useMemo(() => {
    if (!hasQuery) return filteredSessions;
    return filteredSessions.filter((item) => filterSessions(item, query));
  }, [filteredSessions, filterSessions, hasQuery, query]);

  function handleSessionClick(id: string) {
    router.push(`/sessions/${id}`);
  }

  function renderEmptyState() {
    if (hasQuery) {
      return (
        <EmptyState
          variant="item"
          itemVariant="outline"
          className="bg-surface"
          message="0 sessions were found. Try using a different keyword."
          actionLabel="Clear search"
          onAction={() => {
            clearResults();
            setFilters({});
          }}
        />
      );
    }

    if (hasActiveFilters) {
      return (
        <EmptyState
          variant="item"
          itemVariant="outline"
          className="bg-surface"
          message="0 sessions were found with these filters."
          actionLabel="Clear filters"
          onAction={() => setFilters({})}
        />
      );
    }

    return (
      <EmptyState
        variant="item"
        itemVariant="outline"
        className="bg-surface"
        message="You don't have any sessions yet."
        actionLabel="Create Session"
        onAction={() => {
          router.push("/playbooks/create");
        }}
      />
    );
  }

  return (
    <ContentLayout
      title={
        <SearchInput value={query} onChange={search} onClear={clearResults} />
      }
      secondaryHeader={
        <div className="space-y-4">
          <h1>My Sessions</h1>
          <PlaybookFilters
            filters={filters}
            onFilterChange={setFilters}
            availableCourses={availableCourses}
          />
        </div>
      }
    >
      <div className="p-5 pt-30">
        {sessions.length === 0 ? (
          renderEmptyState()
        ) : (
          <SessionList
            sessions={sessions}
            onSessionClick={handleSessionClick}
          />
        )}
      </div>
    </ContentLayout>
  );
}

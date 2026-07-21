"use client";
import {
  PlaybookFilters,
  PlaybookList,
} from "@/features/playbooks/presentation/components";
import { EmptyState } from "@/components/states";
import { usePlaybookFilters } from "@/features/playbooks/presentation/hooks";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/use-search";
import { PlaybookCardDTO } from "@/features/playbooks/application/dto";
import { useCallback, useMemo } from "react";
import { PlaybooksPageOutput } from "@/features/playbooks/application/dto/PlaybooksPageDTO";
import { ContentLayout } from "@/components/sidebar";
import { SearchInput } from "@/components/form";

type PlaybooksPageProps = {
  page: PlaybooksPageOutput;
};

export default function PlaybooksPage({ page }: PlaybooksPageProps) {
  const router = useRouter();
  const {
    filters,
    setFilters,
    filteredPlaybooks,
    availableCourses,
    availableSubjects,
  } = usePlaybookFilters(page.playbooks);

  const filterPlaybooks = useCallback(
    (item: PlaybookCardDTO, query: string): boolean => {
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

  const { query, search, clearResults } = useSearch<PlaybookCardDTO>({
    data: page.playbooks,
    filter: filterPlaybooks,
    minQueryLength: 1,
    debounceMs: 0,
  });

  const hasQuery = query.trim().length > 0;
  const hasActiveFilters = Boolean(
    filters.favorite ||
    filters.course ||
    filters.subject ||
    filters.recent ||
    filters.published,
  );

  const playbooks = useMemo(() => {
    if (!hasQuery) return filteredPlaybooks;
    return filteredPlaybooks.filter((item) => filterPlaybooks(item, query));
  }, [filteredPlaybooks, filterPlaybooks, hasQuery, query]);

  function handlePlaybookClick(id: string) {
    router.push(`/playbooks/${id}`);
  }

  function renderEmptyState() {
    if (hasQuery) {
      return (
        <EmptyState
          variant="item"
          itemVariant="outline"
          className="bg-surface"
          message="0 playbooks were found. Try using a different keyword."
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
          message="0 playbooks were found with these filters."
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
        message="You don't have any playbooks yet."
        actionLabel="Create Playbook"
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
          <h1>My Playbooks</h1>
          <PlaybookFilters
            filters={filters}
            onFilterChange={setFilters}
            availableCourses={availableCourses}
            availableSubjects={availableSubjects}
          />
        </div>
      }
    >
      <div className="p-5 pt-30">
        {playbooks.length === 0 ? (
          renderEmptyState()
        ) : (
          <PlaybookList
            playbooks={playbooks}
            onPlaybookClick={handlePlaybookClick}
          />
        )}
      </div>
    </ContentLayout>
  );
}

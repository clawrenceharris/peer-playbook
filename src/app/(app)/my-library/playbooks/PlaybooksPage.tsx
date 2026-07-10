"use client";
import {
  PlaybookFilters,
  PlaybookList,
} from "@/features/playbooks/presentation/components";
import { EmptyState } from "@/components/states";
import { Button, SearchBar } from "@/components/ui";
import { usePlaybookFilters } from "@/features/playbooks/presentation/hooks";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/use-search";
import { PlaybookCardDTO } from "@/features/playbooks/application/dto";
import { useCallback } from "react";
import { PlaybooksPageOutput } from "@/features/playbooks/application/dto/PlaybooksPageDTO";
type PlaybooksPageProps = {
  page: PlaybooksPageOutput;
};
export default function PlaybooksPage({ page }: PlaybooksPageProps) {
  const router = useRouter();

  const filterPlaybooks = useCallback(
    (item: PlaybookCardDTO, query: string) => {
      return (
        item?.topic?.toLowerCase().includes(query.toLowerCase()) ||
        item?.courseName?.toLowerCase().includes(query.toLowerCase()) ||
        item?.subject?.toLowerCase().includes(query.toLowerCase())
      );
    },
    [],
  );
  const { query, hasSearched, retry, results, search, clearResults } =
    useSearch<PlaybookCardDTO>({
      data: page.playbooks,
      filter: filterPlaybooks,
      minQueryLength: 3,
      debounceMs: 250,
    });

  const { filters, setFilters, filteredPlaybooks, availableCourses } =
    usePlaybookFilters(page.playbooks);
  function handlePlaybookClick(id: string) {
    router.push(`/playbooks/${id}`);
  }

  if (!page.playbooks.length) {
    return (
      <>
        <header className="header">
          <h1>My Playbooks</h1>
          <Button
            variant="secondary"
            onClick={() => router.push("/playbooks/create")}
          >
            <Plus strokeWidth={3} />
            Create Playbook
          </Button>
        </header>
        <div className="container flex items-center justify-center">
          <EmptyState
            className="bg-background border-0 shadow-none"
            variant="card"
            message="You don't have any playbooks at the moment."
          />
        </div>
      </>
    );
  }
  return (
    <>
      <header className="header">
        <h1>My Playbooks</h1>
        <SearchBar value={query} onChange={search} onClear={clearResults} />
      </header>
      <div className="secondary-header w-full">
        <div className="flex w-full flex-col gap-5">
          <PlaybookFilters
            filters={filters}
            onFilterChange={setFilters}
            availableCourses={availableCourses}
          />
        </div>
      </div>
      <div className="container">
        {query && results.length === 0 ? (
          <EmptyState
            variant="item"
            itemVariant="outline"
            title="No Results"
            message="No playbooks match your search or filters."
            actionLabel={hasSearched ? "Clear Search" : "Clear Filters"}
            onSecondaryAction={retry}
            onAction={() => {
              if (hasSearched) clearResults();
              else setFilters({});
            }}
          />
        ) : (
          <div className="h-full w-full max-w-4xl rounded-xl p-2">
            <PlaybookList
              playbooks={page.playbooks}
              onPlaybookClick={handlePlaybookClick}
            />
          </div>
        )}
      </div>
    </>
  );
}

"use client";
import {
  PlaybookFilters,
  PlaybookList,
} from "@/features/playbooks/presentation/components";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui";
import { usePlaybookFilters } from "@/features/playbooks/presentation/hooks";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/use-search";
import { PlaybookCardDTO } from "@/features/playbooks/application/dto";
import { useCallback } from "react";
import { PlaybooksPageOutput } from "@/features/playbooks/application/dto/PlaybooksPageDTO";
import { ContentLayout } from "@/components/sidebar";
import { SearchInput } from "@/components/form";
type PlaybooksPageProps = {
  page: PlaybooksPageOutput;
};
export default function PlaybooksPage({ page }: PlaybooksPageProps) {
  const router = useRouter();

  const filterPlaybooks = useCallback(
    (item: PlaybookCardDTO, query: string): boolean => {
      return (
        (item?.title?.toLowerCase().includes(query.toLowerCase()) ||
          item?.topic?.toLowerCase().includes(query.toLowerCase()) ||
          item?.courseName?.toLowerCase().includes(query.toLowerCase()) ||
          item?.subject?.toLowerCase().includes(query.toLowerCase())) ??
        false
      );
    },
    [],
  );
  const { query, search, clearResults } = useSearch<PlaybookCardDTO>({
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
    <ContentLayout
      contentContainerClassName="p-0"
      title={
        <SearchInput value={query} onChange={search} onClear={clearResults} />
      }
    >
      <div className="secondary-header z-2 flex-col items-start gap-7 pt-6 pb-4">
        <h1>My Playbooks</h1>
        <PlaybookFilters
          filters={filters}
          onFilterChange={setFilters}
          availableCourses={availableCourses}
        />
      </div>
      <div className="container">
        {filteredPlaybooks.length > 0 ? (
          <PlaybookList
            playbooks={filteredPlaybooks}
            onPlaybookClick={handlePlaybookClick}
          />
        ) : (
          <PlaybookList
            playbooks={page.playbooks}
            onPlaybookClick={handlePlaybookClick}
          />
        )}
      </div>
    </ContentLayout>
  );
}

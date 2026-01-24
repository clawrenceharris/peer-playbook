"use client";
import React from "react";
import { PlaybookCard, PlaybookFilters } from "@/features/playbooks/components";
import { EmptyState, ErrorState } from "@/components/states";
import { AppSkeleton, Button, SearchBar } from "@/components/ui";
import {
  useUserPlaybooks,
  usePlaybookFilters,
  usePlaybookSearch,
} from "@/features/playbooks/hooks";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers";
import { selectSortedPlaybooks } from "@/features/playbooks/selectors";

export default function PlaybooksPage() {
  const router = useRouter();
  const { user } = useUser();
  const {
    refetch,
    data: playbooks = [],
    error,
    isLoading,
  } = useUserPlaybooks(user.id, selectSortedPlaybooks);
  const { filters, setFilters, filteredPlaybooks, availableCourses } =
    usePlaybookFilters(playbooks);

  const playbooksSearch = usePlaybookSearch(playbooks);

  const visiblePlaybooks = playbooksSearch.hasSearched
    ? filteredPlaybooks.filter((pb) =>
        playbooksSearch.results.some((r) => r.id === pb.id)
      )
    : filteredPlaybooks;
  if (isLoading) {
    return <AppSkeleton />;
  }
  if (error) {
    return (
      <>
        <ErrorState
          variant="card"
          onRetry={refetch}
          onAction={() => router.replace("/")}
          actionLabel="Go Home"
          message="There was an error finding your Playbooks"
        />
      </>
    );
  }
  if (!playbooks.length) {
    return (
      <>
        <header className="header">
          <h1>My Playbooks</h1>
          <Button
            variant="secondary"
            onClick={() => router.push("/create-playbook")}
          >
            <Plus />
            Create Playbook
          </Button>
        </header>
        <div className="container flex items-center justify-center">

       
          <EmptyState
            className="bg-background shadow-none border-0"
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
        <Button
          className="bg-secondary-foreground hover:bg-muted"
          variant="ghost"
          onClick={() => router.push("/create-playbook")}
        >
          <Plus />
          Create Playbook
        </Button>
      </header>
      <div className="secondary-header justify-between">
        <SearchBar
          value={playbooksSearch.query}
          onChange={playbooksSearch.search}
          onClear={playbooksSearch.clearResults}
        />
        <PlaybookFilters
          filters={filters}
          onFilterChange={setFilters}
          availableCourses={availableCourses}
        />
      </div>
      <div className="container">
        {visiblePlaybooks.length === 0 ? (
          <EmptyState
            variant="item"
            itemVariant="muted"
            title="No Results"
            message="No playbooks match your search or filters."
            actionLabel={
              playbooksSearch.hasSearched ? "Clear Search" : "Clear Filters"
            }
            onAction={() => {
              if (playbooksSearch.hasSearched) playbooksSearch.clearResults();
              else setFilters({});
            }}
          />
        ) : (
          <div className="p-2 rounded-xl border w-full max-w-4xl  h-full">
            <div className="flex flex-col gap-4 overflow-y-auto h-full">
              {visiblePlaybooks.map((playbook) => (
                <PlaybookCard
                  className="hover:bg-secondary-foreground"
                  key={playbook.id}
                  onNavigate={() =>
                    router.push(`/library/playbooks/${playbook.id}`)
                  }
                  playbook={playbook}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

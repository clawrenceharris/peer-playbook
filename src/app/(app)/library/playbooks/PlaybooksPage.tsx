"use client";
import React from "react";
import { PlaybookFilters, PlaybookList } from "@/features/playbooks/components";
import { EmptyState, ErrorState } from "@/components/states";
import { Button, SearchBar, Skeleton } from "@/components/ui";
import {
  useUserPlaybooks,
  usePlaybookFilters,
  usePlaybookSearch,
} from "@/features/playbooks/hooks";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers";
import { selectSortedPlaybooks } from "@/features/playbooks/selectors";
import { Playbook } from "@/features/playbooks/domain";

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

  function handlePlaybookClick(playbook: Playbook) {
    router.push(`/library/playbooks/${playbook.id}`);
  }
  const visiblePlaybooks = playbooksSearch.hasSearched
    ? filteredPlaybooks.filter((pb) =>
        playbooksSearch.results.some((r) => r.id === pb.id),
      )
    : filteredPlaybooks;
  if (isLoading) {
    return (
      <>
        <header className="header">
          <Skeleton className="h-7 w-44 rounded-full" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </header>

        <div className="secondary-header justify-between">
          <Skeleton className="h-10 w-full max-w-140 rounded-full" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-22 rounded-full" />
            <Skeleton className="h-9 w-22 rounded-full" />
            <Skeleton className="h-9 w-22 rounded-full" />
          </div>
        </div>

        <div className="container">
          <div className="p-2 rounded-xl border w-full max-w-4xl h-full">
            <div className="flex flex-col gap-4 overflow-y-auto h-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`playbook-skeleton-${index}`}
                  className="w-full p-5 shadow-sm rounded-md border-l-10 border-l-primary-400 flex-col max-w-4xl bg-primary-foreground"
                >
                  <div className="flex-col md:flex-row w-full flex justify-between">
                    <div className="flex flex-1 gap-3 items-center">
                      <Skeleton className="rounded-sm size-18" />

                      <div className="flex flex-col w-full md:flex-row gap-4 justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-72 rounded-md" />
                          <Skeleton className="h-3 w-44 rounded-md" />
                        </div>

                        <div className="flex gap-2 items-center">
                          <Skeleton className="h-9 w-18 rounded-md" />
                          <Skeleton className="h-9 w-9 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
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
        <SearchBar
          value={playbooksSearch.query}
          onChange={playbooksSearch.search}
          onClear={playbooksSearch.clearResults}
        />
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
        {visiblePlaybooks.length === 0 ? (
          <EmptyState
            variant="item"
            itemVariant="outline"
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
            <PlaybookList
              playbooks={visiblePlaybooks}
              isLoading={isLoading}
              onPlaybookClick={handlePlaybookClick}
            />
          </div>
        )}
      </div>
    </>
  );
}

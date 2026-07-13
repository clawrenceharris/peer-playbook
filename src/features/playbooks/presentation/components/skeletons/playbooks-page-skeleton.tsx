import { Skeleton } from "@/components/ui";

export function PlaybooksPageSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <header className="header w-full">
        <Skeleton className="h-7 w-44 rounded-full" />
        <Skeleton className="h-10 w-40 rounded-md" />
      </header>

      <div className="secondary-header w-full justify-between">
        <Skeleton className="h-10 w-full max-w-140 rounded-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-22 rounded-full" />
          <Skeleton className="h-9 w-22 rounded-full" />
          <Skeleton className="h-9 w-22 rounded-full" />
        </div>
      </div>

      <div className="container">
        <div className="flex h-full flex-col gap-4 overflow-y-auto">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`playbook-skeleton-${index}`}
              className="border-l-primary-400 bg-primary-foreground w-full max-w-4xl flex-col rounded-md border-l-10 p-5 shadow-sm"
            >
              <div className="flex w-full flex-col justify-between md:flex-row">
                <div className="flex flex-1 items-center gap-3">
                  <Skeleton className="size-18 rounded-sm" />

                  <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-72 rounded-md" />
                      <Skeleton className="h-3 w-44 rounded-md" />
                    </div>

                    <div className="flex items-center gap-2">
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
  );
}

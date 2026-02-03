"use client";

import { SessionCard } from "@/features/sessions/components";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";

import { useSessionActions } from "@/features/sessions/hooks";
import { useUserSessions } from "@/features/sessions/hooks";
import { useUser } from "@/app/providers";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function SessionsPage() {
  const { user } = useUser();
  const { data: sessions = [], isLoading, error } = useUserSessions(user.id);
  const { createSession } = useSessionActions();
  const router = useRouter();

  if (isLoading) {
    return <LoadingState />;
  }
  if (error) {
    return (
      <ErrorState
        variant="card"
        onRetry={router.refresh}
        message="There was an error loading your sessions. Come back later and try again."
      />
    );
  }
  return (
    <>
      <div className="header">
        <h1>My Sessions</h1>
        <Button>Create Sessions</Button>
      </div>
      <div className="container">
        {sessions.length > 0 ? (
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <EmptyState
              variant="card"
              message="You don't have any sessions at the moment."
              onAction={createSession}
              actionLabel="Create Session"
            />
          </div>
        )}
      </div>
    </>
  );
}

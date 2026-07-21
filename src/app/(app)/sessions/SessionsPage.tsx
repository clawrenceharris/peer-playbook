"use client";

import { SessionCard } from "@/features/sessions/components";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { useUserSessions } from "@/features/sessions/hooks";
import { useUser } from "@/components/providers";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { ContentLayout } from "@/components/sidebar";
import { useModals } from "@/hooks";

export default function SessionsPage() {
  const { user } = useUser();
  const { data: sessions = [], isLoading, error } = useUserSessions(user.id);
  const router = useRouter();
  const {
    modals: { "session:create": createSessionModal },
  } = useModals();
  function handleCreateSession() {
    createSessionModal.open({ playbook: null });
  }
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
    <ContentLayout
      title="My Sessions"
      headerRight={
        <Button variant="primary" onClick={handleCreateSession}>
          Create Session
        </Button>
      }
    >
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <EmptyState
            variant="card"
            message="You don't have any sessions at the moment."
            onAction={handleCreateSession}
            actionLabel="Create Session"
          />
        </div>
      )}
    </ContentLayout>
  );
}

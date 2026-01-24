"use client";

import { CreateSessionForm, SessionCard } from "@/features/sessions/components";
import { Form } from "@/components/form";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import {
  CreateSessionInput,
  createSessionSchema,
} from "@/features/sessions/domain";
import { useCreateSession, useSessionActions } from "@/features/sessions/hooks";
import { useUserSessions } from "@/features/sessions/hooks";
import { useUser,useModal } from "@/app/providers";
import {
  getFormattedCurrentDateTime,
  getFormattedCurrentTime,
} from "@/utils/date-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function SessionsPage() {
  const { user } = useUser();
  const { data: sessions =[], refetch, isLoading, error } = useUserSessions(user.id);
  const {  createSession } =
    useSessionActions();
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
        <Button>
          Create Sessions
        </Button>
      </div>
      <div className="container">

       {sessions.length > 0 ? <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div> 
          :
          <div className="w-full h-full flex items-center justify-center">

          <EmptyState
          variant="card"
          message="You don't have any sessions at the moment."
          onAction={createSession}
          actionLabel="Create Session"
            />  
        </div>    
      
      }
      </div>
    </>
  );
}

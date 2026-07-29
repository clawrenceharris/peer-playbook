import React from "react";
import { Loader2 } from "lucide-react";
import { EmptyState } from "@/components/states";
import { SessionCardDTO } from "../../application/dto";
import { SessionListItem } from "./session-list-item";

interface SessionCardListProps {
  sessions: SessionCardDTO[];
  isLoading?: boolean;
  onSessionClick?: (id: string) => void;
}
export function SessionList({
  sessions,
  isLoading,
  onSessionClick,
}: SessionCardListProps) {
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="text-primary-400 animate-spin" />
      </div>
    );
  }
  if (sessions.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyState
          title=""
          className="bg-transparent text-center"
          message="You don't have any recent sessions at the moment"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {sessions.map((session) => {
        const cardSession = {
          ...session,
          instructor: session?.instructor ?? {
            id: "",
            displayName: "Unknown instructor",
            avatarUrl: null,
          },
        };

        return (
          <SessionListItem
            key={session.id}
            session={cardSession}
            onClick={() => onSessionClick?.(session.id)}
          />
        );
      })}
    </div>
  );
}

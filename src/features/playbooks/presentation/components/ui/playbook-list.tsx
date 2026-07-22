import React from "react";
import { Loader2 } from "lucide-react";
import { PlaybookCard } from "@/features/playbooks/presentation/components";
import { EmptyState } from "@/components/states";

interface PlaybookListProps {
  playbooks: {
    id: string;
    title: string;
    topic: string;
    courseName: string | null;
    creator?: {
      id: string;
      displayName: string;
      avatarUrl: string | null;
    };
    createdAt: Date;
  }[];
  isLoading?: boolean;
  onPlaybookClick?: (id: string) => void;
}
export function PlaybookList({
  playbooks,
  isLoading,
  onPlaybookClick,
}: PlaybookListProps) {
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="text-primary-400 animate-spin" />
      </div>
    );
  }
  if (playbooks.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyState
          title=""
          className="bg-transparent text-center"
          message="You don't have any recent playbooks at the moment"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {playbooks.map((playbook) => {
        const cardPlaybook = {
          ...playbook,
          creator: playbook.creator ?? {
            id: "",
            displayName: "Unknown creator",
            avatarUrl: null,
          },
        };

        return (
          <PlaybookCard
            key={playbook.id}
            playbook={cardPlaybook}
            onNavigate={() => onPlaybookClick?.(playbook.id)}
          />
        );
      })}
    </div>
  );
}

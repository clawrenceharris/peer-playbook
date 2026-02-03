import React from "react";
import { Playbook } from "@/features/playbooks/domain";
import { Loader2 } from "lucide-react";
import { PlaybookCard } from "@/features/playbooks/components";
import { EmptyState } from "@/components/states";

interface PlaybookListProps {
  playbooks: Playbook[];
  isLoading?: boolean;
  onPlaybookClick?: (playbook: Playbook) => void;
}
export function PlaybookList({
  playbooks,
  isLoading,
  onPlaybookClick,
}: PlaybookListProps) {
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Loader2 className="text-primary-400 animate-spin" />
      </div>
    );
  }
  if (playbooks.length === 0) {
    <div className="flex w-full h-full items-center justify-center">
      <EmptyState
        title=""
        className="bg-transparent text-center"
        message="You don't have any recent playbooks at the moment"
      />
    </div>;
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-full">
      {playbooks.map((playbook) => (
        <PlaybookCard
          key={playbook.id}
          playbook={playbook}
          onNavigate={() => onPlaybookClick?.(playbook)}
        />
      ))}
    </div>
  );
}

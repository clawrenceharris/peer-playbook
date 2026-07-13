"use client";

import { DialogContent } from "@/components/ui";
import { UpdatePlaybookForm } from "..";
import type { UpdatePlaybookModalProps } from "@/lib/modals/types";
import { useModal } from "@/components/providers";
import { usePlaybookDetail } from "@/features/playbooks/presentation/hooks";
import { usePendingMutations } from "@/hooks";
import { EmptyState } from "@/components/states";

export function UpdatePlaybookModal({
  onSubmit,
  playbookId,
}: UpdatePlaybookModalProps) {
  const { closeModal } = useModal();
  const { data: playbook } = usePlaybookDetail(playbookId);
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["update-playbook"],
  });

  return (
    <DialogContent
      title="Edit Playbook"
      description="Update your Playbook's course name or topic."
      className="max-w-2xl"
    >
      {playbook ? (
        <UpdatePlaybookForm
          playbook={playbook}
          onSubmit={onSubmit}
          onSuccess={closeModal}
          isLoading={isLoading}
        />
      ) : (
        <EmptyState
          variant="card"
          title="Playbook not found"
          message="Couldn't find the playbook to update"
        />
      )}
    </DialogContent>
  );
}

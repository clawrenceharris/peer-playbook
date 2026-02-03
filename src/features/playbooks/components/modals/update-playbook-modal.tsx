"use client";

import { DialogContent } from "@/components/ui";
import { UpdatePlaybookForm } from "..";
import type { UpdatePlaybookModalProps } from "@/lib/modals/types";
import { useModal } from "@/app/providers";
import { usePlaybook } from "@/features/playbooks/hooks";
import { usePendingMutations } from "@/hooks";
import { EmptyState } from "@/components/states";

export function UpdatePlaybookModal({
  onConfirm,
  playbookId,
}: UpdatePlaybookModalProps) {
  const { closeModal } = useModal();
  const { data: playbook } = usePlaybook(playbookId);
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
          defaultValues={{
            topic: playbook.topic,
            subject: playbook.subject,
            courseName: playbook.courseName,
          }}
          onSubmit={(data) => onConfirm(data)}
          onCancel={closeModal}
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

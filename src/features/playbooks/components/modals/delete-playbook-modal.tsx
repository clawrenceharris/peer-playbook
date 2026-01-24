"use client";

import { Form } from "@/components/form";
import { DialogContent } from "@/components/ui";
import type { DeletePlaybookModalProps } from "@/lib/modals/types";
import { useModal } from "@/app/providers";
import { usePendingMutations } from "@/hooks";

export function DeletePlaybookModal({
  playbookId,
  onConfirm,
}: DeletePlaybookModalProps) {
  const { closeModal } = useModal();
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["delete-playbook"],
  });
  return (
    <DialogContent
      title="Delete Playbook"
      showsDescription={false}
      description="Are you sure you want to delete this playbook? You can't undo this
        action."
      className="max-w-lg"
    >
      <p>
        Are you sure you want to delete this playbook? You can&apos;t undo this
        action.
      </p>
      <Form<{ confirm: boolean }>
        submitText="I'm sure"
        onSuccess={closeModal}
        onSubmit={async () => {
          await onConfirm(playbookId);
        }}
        onCancel={closeModal}
        isLoading={isLoading}
      />
    </DialogContent>
  );
}

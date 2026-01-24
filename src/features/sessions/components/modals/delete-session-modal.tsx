"use client";

import { useModal } from "@/app/providers";
import { Form } from "@/components/form";
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui";
import { usePendingMutations } from "@/hooks/use-pending-mutations";
import type { DeleteSessionModalProps } from "@/lib/modals/types";

export function DeleteSessionModal({
  sessionId,
  onConfirm,
}: DeleteSessionModalProps) {
  const { closeModal } = useModal();
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["delete-session"],
  });
  return (
    <DialogContent
      className="max-w-lg"
    >
      <DialogTitle>
      Delete Session
      </DialogTitle>
      <DialogDescription>
      Are you sure you want to delete this session? You can&apos;t undo this action.
      </DialogDescription>
      <Form<{ confirm: boolean }>
        id="form-delete-session"
        description="Are you sure you want to delete this session? You can't undo this action."
        descriptionClassName="text-center"
        submitText="I'm sure"
        onSuccess={closeModal}
        onSubmit={async () => {
          await onConfirm(sessionId);
        }}
        onCancel={closeModal}
        isLoading={isLoading}
      />
    </DialogContent>
  );
}

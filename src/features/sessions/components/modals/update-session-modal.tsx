"use client";

import { DialogContent } from "@/components/ui";
import { Form } from "@/components/form";
import { createSessionSchema } from "@/features/sessions/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateSessionModalProps } from "@/lib/modals/types";
import { useModal } from "@/app/providers";
import { useSession } from "../../hooks";
import { EmptyState } from "@/components/states";
import { CreateSessionForm } from "..";
import { usePendingMutations } from "@/hooks";

export function UpdateSessionModal({
  sessionId,
  onConfirm,
  onUpdateStatus,
}: UpdateSessionModalProps) {
  const { closeModal } = useModal();
  const { data: session } = useSession(sessionId);
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["update-session"],
  });
  const handleSubmit = async (
    data: import("@/features/sessions/domain").CreateSessionFormValues
  ) => {
    await onConfirm(sessionId, data);
    if (onUpdateStatus) {
      await onUpdateStatus(sessionId, "scheduled");
    }
  };

  if (!session) {
    return (
      <EmptyState
        title="Session Not Found"
        message="We couldn't find the session you want to update."
      />
    );
  }
  return (
    <DialogContent
      title="Edit Session"
      description={`Edit your ${session.topic} session`}
      className="max-w-2xl"
    >
      <Form
        id="form-update-session"
        resolver={zodResolver(createSessionSchema)}
        defaultValues={{
          status: "scheduled",
          topic: session.topic,
          courseName: session.courseName || "",
          scheduledStart: session.scheduledStart
            ? session.scheduledStart.slice(0, 16)
            : "",
          subject: session.subject,
          mode: session.mode ?? undefined,
        }}
        isLoading={isLoading}
        onCancel={closeModal}
        onSuccess={closeModal}
        onSubmit={handleSubmit}
      >
        <CreateSessionForm />
      </Form>
    </DialogContent>
  );
}

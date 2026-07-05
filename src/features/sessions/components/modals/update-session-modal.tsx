"use client";

import { DialogContent } from "@/components/ui";
import { Form } from "@/components/form";
import {
  createSessionSchema,
  UpdateSessionFormValues,
  updateSessionSchema,
} from "@/features/sessions/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateSessionModalProps } from "@/lib/modals/types";
import { useModal } from "@/components/providers";
import { useSession } from "../../hooks";
import { EmptyState } from "@/components/states";
import { CreateSessionForm } from "..";
import { usePendingMutations } from "@/hooks";
import { useForm } from "react-hook-form";

export function UpdateSessionModal({
  sessionId,
  onSubmit,
  onUpdateStatus,
}: UpdateSessionModalProps) {
  const { closeModal } = useModal();
  const { data: session } = useSession(sessionId);
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["update-session"],
  });
  const form = useForm<UpdateSessionFormValues>({
    resolver: zodResolver(updateSessionSchema),
    defaultValues: {
      status: "scheduled",
      topic: session?.topic ?? "",
      courseName: session?.courseName || "",
      scheduledStart: session?.scheduledStart
        ? session.scheduledStart.slice(0, 16)
        : "",
      mode: session?.mode ?? "virtual",
    },
  });
  const handleSubmit = async (data: UpdateSessionFormValues) => {
    await onSubmit(sessionId, data);
    if (onUpdateStatus) {
      onUpdateStatus(sessionId, "scheduled");
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
      <Form<UpdateSessionFormValues>
        id="form-update-session"
        form={form}
        isLoading={isLoading}
        onCancel={closeModal}
        handleSubmit={handleSubmit}
      >
        <CreateSessionForm />
      </Form>
    </DialogContent>
  );
}

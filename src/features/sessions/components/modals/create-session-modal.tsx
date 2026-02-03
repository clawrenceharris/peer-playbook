"use client";

import React from "react";
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui";
import {
  createSessionSchema,
  type CreateSessionFormValues,
} from "@/features/sessions/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/app/providers";
import { CreateSessionModalProps } from "@/lib/modals";
import { usePendingMutations } from "@/hooks/use-pending-mutations";
import { Form } from "@/components/form/form";
import { CreateSessionForm } from "@/features/sessions/components";

export function CreateSessionModal({
  onConfirm,
  playbook,
}: CreateSessionModalProps) {
  const { closeModal } = useModal();
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["create-session"],
  });
  const handleSubmit = async (data: CreateSessionFormValues) => {
    await onConfirm(data);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogTitle>Create Session</DialogTitle>
      <DialogDescription>
        Create and schedule a new SI session.
      </DialogDescription>
      <Form
        id="form-create-session"
        defaultValues={{
          topic: playbook?.topic || "",
          courseName: playbook?.courseName || "",
          subject: playbook?.subject || "",
          playbookId: playbook?.id,
          mode: playbook?.modes.length ? playbook?.modes[0] : undefined,
        }}
        resolver={zodResolver(createSessionSchema)}
        onCancel={closeModal}
        onSuccess={closeModal}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <CreateSessionForm />
      </Form>
    </DialogContent>
  );
}

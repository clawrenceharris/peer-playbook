"use client";

import React from "react";
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui";
import {
  createSessionSchema,
  type CreateSessionFormValues,
} from "@/features/sessions/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/components/providers";
import { CreateSessionModalProps } from "@/lib/modals";
import { usePendingMutations } from "@/hooks/use-pending-mutations";
import { Form } from "@/components/form";
import { CreateSessionForm } from "@/features/sessions/components";
import { useForm } from "react-hook-form";

export function CreateSessionModal({
  onSuccess,
  playbook,
}: CreateSessionModalProps) {
  const { closeModal } = useModal();
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["create-session"],
  });
  const form = useForm<CreateSessionFormValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      topic: playbook?.topic || "",
      courseName: playbook?.courseName || "",
      playbookId: playbook?.id,
    },
  });
  function handleSubmit(data: CreateSessionFormValues) {
    onSuccess(data);
  }
  return (
    <DialogContent className="max-w-2xl">
      <DialogTitle>Create Session</DialogTitle>
      <DialogDescription>
        Create and schedule a new SI session.
      </DialogDescription>
      <Form
        id="form-create-session"
        form={form}
        onCancel={closeModal}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <CreateSessionForm />
      </Form>
    </DialogContent>
  );
}

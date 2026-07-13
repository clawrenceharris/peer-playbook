"use client";

import React from "react";
import { DialogContent } from "@/components/ui";
import {
  createSessionSchema,
  type CreateSessionFormValues,
} from "@/features/sessions/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSessionModalProps } from "@/lib/modals";
import { usePendingMutations } from "@/hooks/use-pending-mutations";
import { Form } from "@/components/form";
import { CreateSessionForm } from "@/features/sessions/components";
import { useForm } from "react-hook-form";

export function CreateSessionModal({
  onCancel,
  playbook,
}: CreateSessionModalProps) {
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["create-session"],
  });
  const form = useForm<CreateSessionFormValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      topic: playbook?.topic || "",
      courseName: playbook?.courseName || "",
      description: "",
      status: "scheduled",
      subject: "",
      mode: "in-person",
      scheduledStart: new Date().toISOString(),
    },
  });

  return (
    <DialogContent
      title="Create Session"
      description="Create and schedule a new study session."
    >
      <Form
        id="form-create-session"
        form={form}
        onCancel={onCancel}
        // handleSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <CreateSessionForm />
      </Form>
    </DialogContent>
  );
}

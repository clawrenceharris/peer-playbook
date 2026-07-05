"use client";

import { DialogContent } from "@/components/ui";
import { UpdatePlaybookForm } from "..";
import type { UpdatePlaybookModalProps } from "@/lib/modals/types";
import { useModal } from "@/components/providers";
import { usePlaybook } from "@/features/playbooks/hooks";
import { usePendingMutations } from "@/hooks";
import { EmptyState } from "@/components/states";
import {
  UpdatePlaybookFormValues,
  updatePlaybookSchema,
} from "../../domain/playbook.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function UpdatePlaybookModal({
  onSubmit: onConfirm,
  playbookId,
}: UpdatePlaybookModalProps) {
  const { closeModal } = useModal();
  const { data: playbook } = usePlaybook(playbookId);
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["update-playbook"],
  });
  const form = useForm<UpdatePlaybookFormValues>({
    resolver: zodResolver(updatePlaybookSchema),
    defaultValues: {
      subject: playbook?.subject ?? "",
      topic: playbook?.topic ?? "",
      courseName: playbook?.courseName ?? "",
    },
  });
  return (
    <DialogContent
      title="Edit Playbook"
      description="Update your Playbook's course name or topic."
      className="max-w-2xl"
    >
      {playbook ? (
        <UpdatePlaybookForm
          form={form}
          handleSubmit={(data) => onConfirm(data)}
          onCancel={closeModal}
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

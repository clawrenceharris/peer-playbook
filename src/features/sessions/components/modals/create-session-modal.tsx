"use client";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  ScrollArea,
  DialogTitle,
} from "@/components/ui";
import { CreateSessionModalProps } from "@/lib/modals";
import { Form } from "@/components/form";
import { CreateSessionForm } from "@/features/sessions/components";
import { useCreateSessionForm } from "../../hooks";
import { CreateSessionFormValues } from "@/lib/validation";
import { useModal } from "@/components/providers";

export function CreateSessionModal({
  onCancel,
  playbook,
}: CreateSessionModalProps) {
  const { closeModal } = useModal();
  const { form, createSession, isLoading, playbooks, selectPlaybook } =
    useCreateSessionForm({ playbook, onSuccess: closeModal });
  return (
    <DialogContent className="flex max-h-[min(900px,90vh)] min-w-[60vw] flex-col gap-0 sm:max-w-md">
      <DialogHeader className="contents w-full space-y-2 bg-red-400 text-left">
        <DialogTitle className="px-4 pt-3">Create a session</DialogTitle>
        <ScrollArea className="flex flex-col overflow-hidden">
          <div className="px-4">
            <DialogDescription>
              Create a new session for {playbook?.title ?? ""} to add to your
              schedule.
            </DialogDescription>
            <Form<CreateSessionFormValues>
              id="form-create-session"
              form={form}
              onCancel={onCancel}
              handleSubmit={createSession}
              showsCancelButton
              submitButtonClassName="max-w-60"
              isLoading={isLoading}
            >
              <CreateSessionForm
                playbooks={playbooks}
                onPlaybookSelect={selectPlaybook}
                showPlaybookSelector
              />
            </Form>
          </div>
        </ScrollArea>
      </DialogHeader>
    </DialogContent>
  );
}

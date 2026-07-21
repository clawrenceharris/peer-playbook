import { Form } from "@/components/form";
import { DialogContent } from "@/components/ui";
import {
  BuildPlaybookFormValues,
  CreatePlaybookFromScratchFormValues,
} from "@/lib/validation";
import { useCreatePlaybookForm } from "../../hooks";
import { LessonDetailsSection } from "../forms/sections";
import { CreatePlaybookModalProps } from "@/lib/modals/types";

export function CreatePlaybookModal({
  userId,
  onCancel,
}: CreatePlaybookModalProps) {
  const { form, createPlaybook, isLoading } = useCreatePlaybookForm({
    userId,
  });
  return (
    <DialogContent
      size="xl"
      title="Create Playbook"
      description="Skip the extra set up and jump straight into the playbook workspace. Just enter a few initial details and go from there!"
    >
      <Form<CreatePlaybookFromScratchFormValues>
        form={form}
        isLoading={isLoading}
        id="form-create-playbook"
        handleSubmit={createPlaybook}
        onCancel={onCancel}
        submitText="Create Playbook"
        showsCancelButton
      >
        <LessonDetailsSection />
      </Form>
    </DialogContent>
  );
}

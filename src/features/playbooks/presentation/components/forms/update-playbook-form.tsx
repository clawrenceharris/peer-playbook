"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import {
  UpdatePlaybookFormValues,
  updatePlaybookSchema,
} from "@/lib/validation";
import { LessonDetailsSection, NotesSection } from "./sections";
import { useForm } from "react-hook-form";
import { PlaybookDetailDTO } from "@/features/playbooks/application/dto";

type UpdatePlaybookFormProps = {
  playbook: Pick<
    PlaybookDetailDTO,
    "title" | "subject" | "topic" | "courseName"
  >;
  onSubmit: (data: UpdatePlaybookFormValues) => Promise<unknown>;
  onSuccess?: () => void;
  isLoading?: boolean;
};
export function UpdatePlaybookForm({
  playbook,
  onSubmit,
  onSuccess,
  isLoading,
}: UpdatePlaybookFormProps) {
  const form = useForm<UpdatePlaybookFormValues>({
    resolver: zodResolver(updatePlaybookSchema),
    defaultValues: {
      title: playbook?.title ?? "",
      subject: playbook?.subject ?? "",
      topic: playbook?.topic ?? "",
      courseName: playbook?.courseName ?? "",
    },
  });
  return (
    <Form<UpdatePlaybookFormValues>
      form={form}
      enableBeforeUnloadProtection={false}
      handleSubmit={async (data) => {
        await onSubmit(data);
        onSuccess?.();
      }}
      isLoading={isLoading}
      submitText="Done"
      showsCancelButton={false}
    >
      <FieldGroup>
        <LessonDetailsSection />
        <NotesSection />
      </FieldGroup>
    </Form>
  );
}

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLayoutProps } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import {
  UpdatePlaybookFormValues,
  updatePlaybookSchema,
} from "@/lib/validation";
import { LessonDetailsSection, NotesSection } from "./sections";
import { useForm } from "react-hook-form";
import { PlaybookDetailDTO } from "@/features/playbooks/application/dto";

type UpdatePlaybookFormProps = {
  subjects: { id: string; label: string; icon: React.ReactNode }[];
  playbook: Pick<PlaybookDetailDTO, "subject" | "topic" | "courseName">;
};
export function UpdatePlaybookForm({
  subjects,
  playbook,
}: UpdatePlaybookFormProps) {
  const form = useForm<UpdatePlaybookFormValues>({
    resolver: zodResolver(updatePlaybookSchema),
    defaultValues: {
      subject: playbook?.subject ?? "",
      topic: playbook?.topic ?? "",
      courseName: playbook?.courseName ?? "",
    },
  });
  return (
    <Form<UpdatePlaybookFormValues>
      form={form}
      enableBeforeUnloadProtection={false}
      submitText="Done"
      showsCancelButton={false}
    >
      <FieldGroup>
        <LessonDetailsSection subjects={subjects} />
        <NotesSection />
      </FieldGroup>
    </Form>
  );
}

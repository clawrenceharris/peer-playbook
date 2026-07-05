"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLayoutProps } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import {
  UpdatePlaybookFormValues,
  updatePlaybookSchema,
} from "@/features/playbooks/domain";
import { LessonDetailsSection, NotesSection } from "./sections";
import { useForm } from "react-hook-form";

export function UpdatePlaybookForm({
  ...props
}: FormLayoutProps<UpdatePlaybookFormValues>) {
  const form = useForm<UpdatePlaybookFormValues>({
    resolver: zodResolver(updatePlaybookSchema),
    defaultValues: {
      subject: "",
      courseName: "",
      topic: "",
    },
  });
  return (
    <Form<UpdatePlaybookFormValues>
      {...props}
      form={form}
      enableBeforeUnloadProtection={false}
      submitText="Done"
      showsCancelButton={false}
    >
      <FieldGroup>
        <LessonDetailsSection courseIsOptional topicIsOptional />
        <NotesSection />
      </FieldGroup>
    </Form>
  );
}

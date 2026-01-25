"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLayoutProps } from "@/components/form/form";
import { FieldGroup } from "@/components/ui";
import {
  UpdatePlaybookFormInput,
  updatePlaybookSchema,
} from "@/features/playbooks/domain";
import { LessonDetailsSection, NotesSection } from "./sections";

export function UpdatePlaybookForm({
  ...props
}: FormLayoutProps<UpdatePlaybookFormInput>) {
  return (
    <Form<UpdatePlaybookFormInput>
      resolver={zodResolver(updatePlaybookSchema)}
      defaultValues={{
        subject: "",
        courseName: "",
        topic: "",
        notes: "",
      }}
      enableBeforeUnloadProtection={false}
      submitText="Done"
      showsCancelButton={false}
      {...props}
    >
      <FieldGroup>
        <LessonDetailsSection<UpdatePlaybookFormInput>
          courseIsOptional
          topicIsOptional
        />
        <NotesSection<UpdatePlaybookFormInput> />
      </FieldGroup>
    </Form>
  );
}

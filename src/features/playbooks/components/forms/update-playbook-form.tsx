"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLayoutProps } from "@/components/form/form";
import { FieldGroup } from "@/components/ui";
import {
  UpdatePlaybookFormValues,
  updatePlaybookSchema,
} from "@/features/playbooks/domain";
import { LessonDetailsSection, NotesSection } from "./sections";

export function UpdatePlaybookForm({
  ...props
}: FormLayoutProps<UpdatePlaybookFormValues>) {
  return (
    <Form<UpdatePlaybookFormValues>
      resolver={zodResolver(updatePlaybookSchema)}
      enableBeforeUnloadProtection={false}
      submitText="Done"
      showsCancelButton={false}
      {...props}
    >
      <FieldGroup>
        <LessonDetailsSection courseIsOptional topicIsOptional />
        <NotesSection />
      </FieldGroup>
    </Form>
  );
}

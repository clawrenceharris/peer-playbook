"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLayoutProps } from "@/components/form/form";
import { FieldGroup, FieldSet } from "@/components/ui";
import {
  UpdatePlaybookFormInput,
  updatePlaybookSchema,
} from "@/features/playbooks/domain";
import { InputField, SelectField } from "@/components/form";
import { subjects } from "@/lib/constants";

export function UpdatePlaybookForm({
  ...props
}: FormLayoutProps<UpdatePlaybookFormInput>) {
  return (
    <Form<UpdatePlaybookFormInput>
      resolver={zodResolver(updatePlaybookSchema)}
      defaultValues={{
        courseName: "",
        topic: "",
      }}
      enableBeforeUnloadProtection={false}
      submitText="Done"
      showsCancelButton={false}
      {...props}
    >
      <FieldGroup>
        <FieldSet>
          <SelectField<UpdatePlaybookFormInput>
            name="subject"
            defaultValue=""
            items={Object.keys(subjects).map((s) => ({
              key: s,
              value: s,
              icon: subjects[s],
            }))}
            label="Course"
            placeholder="Course"
          />
          <InputField<UpdatePlaybookFormInput>
            name="courseName"
            label="Course"
            defaultValue=""
            placeholder="Course"
          />
          <InputField<UpdatePlaybookFormInput>
            name="topic"
            label="Topic"
            defaultValue=""
            placeholder="Topic"
          />
        </FieldSet>
      </FieldGroup>
    </Form>
  );
}

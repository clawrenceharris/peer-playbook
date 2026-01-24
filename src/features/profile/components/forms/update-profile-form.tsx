"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormLayoutProps } from "@/components/form/form";
import { FieldGroup, FieldSet } from "@/components/ui";
import { InputField, SelectField } from "@/components/form";
import { subjects } from "@/lib/constants";
import { updateProfileSchema } from "../../domain";

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export function UpdateProfileForm({
  ...props
}: FormLayoutProps<UpdateProfileFormValues>) {
  return (
    <Form<UpdateProfileFormValues>
      resolver={zodResolver(updateProfileSchema)}
      enableBeforeUnloadProtection={false}
      submitText="Done"
      showsCancelButton={false}
      {...props}
    >
      <FieldGroup>
        <FieldSet>
          <SelectField<UpdateProfileFormValues>
            name="firstName"
            defaultValue=""
            items={Object.keys(subjects).map((s) => ({
              key: s,
              value: s,
              icon: subjects[s],
            }))}
            label="First name"
            placeholder="First name"
          />
          <InputField<UpdateProfileFormValues>
            name="lastName"
            label="Last name"
            defaultValue=""
            placeholder="Last name"
          />
          <InputField<UpdateProfileFormValues>
            name="coursesInstructed"
            label="Topic"
            defaultValue={[]}
            placeholder="Topic"
          />
          <InputField<UpdateProfileFormValues>
            name="avatarUrl"
            label="Avatar"
            defaultValue=""
            placeholder="Topic"
          />
        </FieldSet>
      </FieldGroup>
    </Form>
  );
}

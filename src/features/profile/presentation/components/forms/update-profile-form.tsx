"use client";

import { Form, InputField } from "@/components/form";
import { SelectField } from "@/components/form/select-field";
import { FieldGroup } from "@/components/ui";
import { UpdateProfileFormValues } from "@/lib/validation";
import { ProfileAvatarField } from "./profile-avatar-field";
import { UpdateProfileModalProps } from "@/lib/modals";
import { useUpdateProfileForm } from "../../hooks";
import { subjects } from "@/features/playbooks/application/assemblers/PlaybookCreationPageAssembler";

export function UpdateProfileForm({
  profile,
  onCancel,
  onSuccess,
}: UpdateProfileModalProps) {
  const { form, isLoading, updateProfile } = useUpdateProfileForm({
    profile,
  });
  return (
    <Form<UpdateProfileFormValues>
      form={form}
      onCancel={onCancel}
      handleSubmit={updateProfile}
      showsCancelButton={false}
      isLoading={isLoading}
    >
      <FieldGroup>
        <ProfileAvatarField<UpdateProfileFormValues, "avatarFile">
          profile={null}
          name="avatarFile"
        />

        <InputField<UpdateProfileFormValues, "firstName">
          name="firstName"
          defaultValue=""

          label="First name"
          placeholder="First name"
        />
        <InputField<UpdateProfileFormValues, "lastName">
          name="lastName"
          label="Last name"
          defaultValue=""
          placeholder="Last name"
        />
        <SelectField<UpdateProfileFormValues, "courses">
          name="courses"
          items={subjects.map((s) => ({
            value: s.id,
            label: s.label,
            icon: s.icon,
          }))}

          label="Courses instructed"
          placeholder="Courses instructed"
        />
        <ProfileAvatarField<UpdateProfileFormValues, "avatarFile">
          profile={profile ?? null}
          name={"avatarFile"}
        />
      </FieldGroup>
    </Form>
  );
}

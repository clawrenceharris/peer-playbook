"use client";

import { Form, InputField } from "@/components/form";
import { SelectField } from "@/components/form/select-field";
import { FieldGroup } from "@/components/ui";
import { UpdateProfileFormValues, updateProfileSchema } from "@/lib/validation";
import { ProfileAvatarField } from "./profile-avatar-field";
import { subjects } from "@/lib/constants";
import { UpdateProfileModalProps } from "@/lib/modals";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfileForm } from "../../hooks";

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

        <SelectField<UpdateProfileFormValues, "firstName">
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
        <InputField<UpdateProfileFormValues, "lastName">
          name="lastName"
          label="Last name"
          defaultValue=""
          placeholder="Last name"
        />
        <SelectField<UpdateProfileFormValues, "courses">
          name="courses"
          defaultValue={[]}
          items={Object.keys(subjects).map((s) => ({
            key: s,
            value: s,
            icon: subjects[s],
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

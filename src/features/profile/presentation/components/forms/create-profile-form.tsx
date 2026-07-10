"use client";
import { Form, InputField } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import { type CreateProfileFormValues } from "@/lib/validation";
import { useCreateProfile } from "../../hooks";
import { ProfileAvatarField } from "./profile-avatar-field";

type CreateProfileFormProps = {
  onSuccess: () => void;
  userId: string;
};

export function CreateProfileForm({
  onSuccess,
  userId,
}: CreateProfileFormProps) {
  const { form, isLoading, createProfile } = useCreateProfile({
    userId,
    onSuccess,
  });
  const { getValues } = form;

  return (
    <Form<CreateProfileFormValues>
      isLoading={isLoading}
      form={form}
      enableBeforeUnloadProtection={false}
      isDialog
      id="create-profile-form"
      showsCancelButton={false}
      onCancel={() => createProfile(getValues())}
      handleSubmit={createProfile}
    >
      <FieldGroup>
        <ProfileAvatarField<CreateProfileFormValues, "avatarFile">
          profile={null}
          name="avatarFile"
        />

        <InputField<CreateProfileFormValues, "firstName">
          name="firstName"
          label="First name"
          placeholder="First name"
        />
        <InputField<CreateProfileFormValues, "lastName">
          name="lastName"
          label="Last name"
          placeholder="Last name"
        />
        {/* <SelectField<CreateProfileFormValues, "courses">
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
        */}
      </FieldGroup>
    </Form>
  );
}

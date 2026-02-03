import { InputField, SelectField } from "@/components/form";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { CreateSessionFormValues } from "@/features/sessions/domain";
import { subjects } from "@/lib/constants";

import { Controller, useFormContext } from "react-hook-form";

export const CreateSessionForm = () => {
  const { control } = useFormContext<CreateSessionFormValues>();

  return (
    <FieldGroup>
      <FieldSet className="grid grid-cols-1 md:grid-cols-2 items-start gap-2 md:gap-3">
        <FieldLegend>Session Details</FieldLegend>
        <SelectField<CreateSessionFormValues>
          name="subject"
          label="Subject"
          showsLabel={false}
          placeholder="Subject*"
          defaultValue=""
          items={Object.keys(subjects).map((s) => ({
            key: s,
            value: s,
            icon: subjects[s],
          }))}
        />

        <InputField<CreateSessionFormValues>
          name="courseName"
          label={"Course"}
          showsLabel={false}
          placeholder="Course*"
          defaultValue=""
        />

        <InputField<CreateSessionFormValues>
          name="topic"
          label={"Topic"}
          placeholder="Topic*"
          showsLabel={false}
          defaultValue=""
        />
        <InputField<CreateSessionFormValues>
          name="scheduledStart"
          type="datetime-local"
          label="Start Date"
          showsLabel={false}
          defaultValue={(() => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            return `${year}-${month}-${day}T${hours}:${minutes}`;
          })()}
        />
      </FieldSet>

      <Controller
        name="mode"
        control={control}
        render={({ field, fieldState }) => (
          <FieldSet>
            <FieldLabel>Mode</FieldLabel>

            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              aria-invalid={fieldState.invalid}
            >
              <FieldLabel htmlFor="in-person">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>In-Person</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="in-person" id="in-person" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="virtual">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Virtual</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="virtual" id="virtual" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="hybrid">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Hybrid</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="hybrid" id="hybrid" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
        )}
      />
    </FieldGroup>
  );
};

"use client";

import React from "react";
import {
  Checkbox,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui";
import type { Enums } from "@/types";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";

export function ModesSection<T extends FieldValues>() {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={"modes" as any}
      control={control}
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend className="sr-only" variant="label">
            Session Details
          </FieldLegend>
          <FieldLabel>
            Modes
            <span className="text-muted-foreground text-sm font-normal">
              (Optional)
            </span>
          </FieldLabel>

          <FieldDescription>
            What classroom format should this playbook be designed for? (Select
            all that apply)
          </FieldDescription>

          <FieldGroup data-slot="checkbox-group">
            {(["in-person", "virtual", "hybrid"] as Enums<"session_mode">[]).map(
              (mode) => (
                <Field key={mode} orientation="horizontal">
                  <Checkbox
                    id={`form-rhf-checkbox-${mode}`}
                    name={field.name}
                    aria-invalid={fieldState.invalid}
                    checked={(field.value ?? []).includes(mode)}
                    onCheckedChange={(checked) => {
                      const prev: string[] = field.value ?? [];
                      const newValue = checked
                        ? [...prev, mode]
                        : prev.filter((value) => value !== mode);
                      field.onChange(newValue);
                    }}
                  />
                  <FieldLabel
                    htmlFor={`form-rhf-checkbox-${mode}`}
                    className="font-normal capitalize"
                  >
                    {mode}
                  </FieldLabel>
                </Field>
              ),
            )}
          </FieldGroup>
        </FieldSet>
      )}
    />
  );
}


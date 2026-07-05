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
import { Controller, useFormContext } from "react-hook-form";

export function ModesSection() {
  const { control } = useFormContext<{ modes: Enums<"session_mode">[] }>();

  return (
    <Controller<{ modes: Enums<"session_mode">[] }>
      name="modes"
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
                      const prev = field.value ?? [];
                      let newValue: Enums<"session_mode">[];
                      if (checked) {
                        // Ensure prev is always an array
                        newValue = Array.isArray(prev) ? [...prev, mode] : [mode];
                      } else {
                        newValue = Array.isArray(prev)
                          ? prev.filter((value) => value !== mode)
                          : [];
                      }
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


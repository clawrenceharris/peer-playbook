import React from "react";
import { Controller, FieldValues, useFormContext, Path, useController } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Textarea,
} from "../ui";
import { cn } from "@/lib/utils";
import type { InputFieldProps } from "@/types";
export function TextareaField<T extends FieldValues, U extends Path<T>>({
  className,
  label,
  description,
  showsLabel = true,
  required,
  placeholder,
  name,
}: InputFieldProps<T, U>) {
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController<T, U>({ name, control });
  return (
    
        <Field>
          <FieldLabel
            className={!showsLabel ? "sr-only" : ""}
            htmlFor={field.name}
          >
            {label}
            {required && (
              <span className="text-muted-foreground text-sm font-normal">
                (Optional)
              </span>
            )}
          </FieldLabel>
          <Textarea
            {...field}
            id={field.name}
            className={cn("min-h-30", className)}
            aria-invalid={fieldState.invalid}
            aria-required={required}
            placeholder={`${placeholder} ${required ? "*" : ""}`}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
  );
}

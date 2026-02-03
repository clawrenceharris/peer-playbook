import React from "react";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Textarea,
} from "../ui";
import { cn } from "@/lib/utils";
import { FieldProps } from "@/types";

export function TextareaField<T extends FieldValues>({
  className,
  label,
  description,
  showsLabel = true,
  isOptional = false,
  placeholder,
  name,
  rules,
  shouldUnregister,
  defaultValue,
  ...textareaProps
}: FieldProps<T, "textarea">) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel
            className={!showsLabel ? "sr-only" : ""}
            htmlFor={field.name}
          >
            {label}
            {isOptional && (
              <span className="text-muted-foreground text-sm font-normal">
                (Optional)
              </span>
            )}
          </FieldLabel>
          <Textarea
            {...field}
            {...textareaProps}
            id={field.name}
            className={cn("min-h-30", className)}
            aria-invalid={fieldState.invalid}
            aria-required={!isOptional}
            placeholder={`${placeholder} ${!isOptional ? "*" : ""}`}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

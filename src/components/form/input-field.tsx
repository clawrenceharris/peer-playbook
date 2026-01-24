import React from "react";
import {
  Controller,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Input } from "../ui";
import { FieldProps } from "@/types";

export function InputField<T extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  showsLabel = true,
  isOptional,
  rules,
  shouldUnregister,
  defaultValue,
  ...inputProps
}: FieldProps<T, "input">) {
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
          <FieldContent>
          <FieldLabel
            className={!showsLabel ? "sr-only" : ""}
              htmlFor={field.name}>
              {label}
              {isOptional && (
              <span className="text-muted-foreground text-sm font-normal">
                (Optional)
              </span>
            )}
            </FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}

          </FieldContent>
          
          <Input
            {...field}
            {...inputProps}
            aria-required={!isOptional}
            id={field.name}
            placeholder={`${placeholder}${!isOptional ? "*" : ""}`}
            aria-invalid={fieldState.invalid}
            
            
          />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
     
    />
  );
}

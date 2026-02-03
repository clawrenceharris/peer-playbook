import React from "react";
import { FieldProps } from "@/types";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import {
  Combobox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui";

interface SelectFieldProps<T extends FieldValues>
  extends FieldProps<T, "input"> {
  items: { icon: React.ReactNode; value: string; label: string }[];
}

export function ComboboxField<T extends FieldValues>({
  name,
  label,
  description,
  showsLabel = true,
  isOptional,
  placeholder,
  items,
  fieldClassName,
  rules,
  shouldUnregister,
  defaultValue,
  ...comboboxProps
}: SelectFieldProps<T>) {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Field className={fieldClassName}>
          <FieldContent>
            <FieldLabel
              className={!showsLabel ? "sr-only" : ""}
              htmlFor={field.name}
            >
              {label}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          <Combobox
            {...comboboxProps}
            onValueChange={field.onChange}
            value={field.value}
            items={items}
            placeholder={`${placeholder}${!isOptional ? "*" : ""}`}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

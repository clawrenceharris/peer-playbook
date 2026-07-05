import React from "react";
import { InputFieldProps } from "@/types";
import { Controller, FieldValues, Path, useController, useFormContext } from "react-hook-form";
import {
  Combobox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui";

interface ComboboxFieldProps<T extends FieldValues, U extends Path<T>>
  extends InputFieldProps<T, U> {
  items: { icon: React.ReactNode; value: string; label: string }[];
}

export function ComboboxField<T extends FieldValues, U extends Path<T>>({
  name,
  label,
  description,
  showsLabel = true,
  required,
  placeholder,
  items,
  inputId: inputIdProp,
  className,
  ...comboboxProps
}: ComboboxFieldProps<T, U>) {
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController<T, U>({ name, control });
  const inputId = inputIdProp || field.name;
  return (
    
        <Field className={className}>
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
            inputId={inputId}
            onValueChange={field.onChange}
            value={field.value}
            items={items}
            placeholder={`${placeholder}${required ? "*" : ""}`}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
     
  );
}

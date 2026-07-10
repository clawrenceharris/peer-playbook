import React from "react";
import { InputFieldProps } from "@/types";
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from "react-hook-form";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxContent,
  ComboboxInput,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui";

interface ComboboxFieldProps<
  T extends FieldValues,
  U extends Path<T>,
> extends InputFieldProps<T, U> {
  items: { value: string; label: string; icon?: React.ReactNode }[];
  emptyMessage?: string;
}

export function ComboboxField<T extends FieldValues, U extends Path<T>>({
  name,
  label,
  description,
  showsLabel = true,
  required,
  placeholder,
  items,
  emptyMessage = "No items found.",
  inputId: inputIdProp,
  className,
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
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
        items={items}
        aria-invalid={fieldState.invalid}
        aria-required={required}
        id={inputId}
      >
        <ComboboxInput placeholder={`${placeholder}${required ? "*" : ""}`} />

        <ComboboxContent>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.icon}
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

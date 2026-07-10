import React from "react";
import { InputFieldProps } from "@/types";
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui";

interface SelectFieldProps<
  T extends FieldValues,
  U extends Path<T>,
> extends InputFieldProps<T, U> {
  items: {
    icon?: React.ReactNode;
    value: string;
    label: string;
  }[];
  onValueSelect?: (value: string) => void;
}

export function SelectField<T extends FieldValues, U extends Path<T>>({
  name,
  label,
  description,
  showsLabel = true,
  required,
  placeholder,
  inputId: inputIdProp,
  items,
  className,
  onValueSelect,
}: SelectFieldProps<T, U>) {
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });
  const inputId = inputIdProp ?? field.name;
  function handleValueSelect(value: string) {
    field.onChange(value);
    onValueSelect?.(value);
  }
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
      <Select {...field} onValueChange={handleValueSelect} dir="ltr">
        <SelectTrigger
          id={field.name}
          aria-invalid={fieldState.invalid}
          aria-required={required}
        >
          <SelectValue
            id={inputId}
            placeholder={`${placeholder}${required ? "*" : ""}`}
          />
        </SelectTrigger>

        <SelectContent align="start" side="bottom">
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {items.map((item) => (
              <SelectItem value={item.value} key={item.value}>
                {item.icon}
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

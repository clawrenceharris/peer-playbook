import React from 'react'
import { FieldProps } from '@/types'
import { Controller, FieldValues, useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui';

interface SelectFieldProps<T extends FieldValues> extends FieldProps<T, "select"> {
  items: { icon: React.ReactNode; value: string; key: string; }[];
  placeholder?: string;

}

export function SelectField<T extends FieldValues>({
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
  ...selectProps 
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
            <FieldLabel className={!showsLabel ? "sr-only" : ""} htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          <Select
            {...selectProps}
            dir='ltr'
            name={field.name}
            value={field.value ?? ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
              aria-required={!isOptional}
            >
              <SelectValue
                placeholder={`${placeholder}${!isOptional ? "*" : ""}`}              
              />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {items.map((item) => (
                  <SelectItem value={item.value} key={item.key}>
                    {item.icon}
                    {item.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
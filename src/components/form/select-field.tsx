import React from 'react'
import { InputFieldProps } from '@/types'
import { Controller, FieldValues, Path, useController, useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui';

interface SelectFieldProps<T extends FieldValues, U extends Path<T>> extends InputFieldProps<T, U> {
  items: { icon: React.ReactNode; value: string; key: string; }[];

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
  defaultValue,
  ...selectProps 
}: SelectFieldProps<T, U>) {
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });
  const inputId = inputIdProp ?? field.name;

  return (
    
        <Field className={className}>
          <FieldContent>
            <FieldLabel className={!showsLabel ? "sr-only" : ""} htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          <Select
            {...field}
            dir='ltr'
            
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
              aria-required={required}
            >
              <SelectValue
                placeholder={`${placeholder}${required ? "*" : ""}`}              
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
      
    
  );
}
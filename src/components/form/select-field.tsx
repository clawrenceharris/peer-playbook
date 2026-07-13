import React from "react";
import { InputFieldProps } from "@/types";
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/utils";
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
    description?: string;
  }[];
  value?: string;
  defaultValue?: string;
  onValueSelect?: (value: string) => void;
}

export function SelectField<T extends FieldValues, U extends Path<T>>({
  name,
  label,
  description,
  showsLabel = true,
  required,
  value,
  defaultValue,
  placeholder,
  inputId: inputIdProp,
  items,
  orientation = "vertical",
  className,
  onValueSelect,
  ...inputProps
}: SelectFieldProps<T, U>) {
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });
  const inputId = inputIdProp ?? field.name;
  const selectedItem = items.find((item) => item.value === field.value);
  const hasItemDescriptions = items.some((item) => item.description);
  function handleValueSelect(value: string) {
    field.onChange(value);
    onValueSelect?.(value);
  }
  return (
    <Field className={className} orientation={orientation}>
      <FieldContent>
        <FieldLabel
          className={!showsLabel ? "sr-only" : ""}
          htmlFor={field.name}
        >
          {label}
        </FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <Select
        {...inputProps}
        {...field}
        onValueChange={handleValueSelect}
        dir="ltr"
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={fieldState.invalid}
          aria-required={required}
          className={cn(
            "border-border border shadow-xs",
            hasItemDescriptions &&
              "h-auto min-h-17 w-full items-center py-2 *:data-[slot=select-value]:line-clamp-none",
          )}
        >
          {selectedItem?.description ? (
            <SelectValue
              id={inputId}
              placeholder={`${placeholder}${required ? "*" : ""}`}
            >
              <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
                <span className="flex min-w-0 items-center gap-2">
                  {selectedItem.icon}
                  <span className="truncate font-medium">
                    {selectedItem.label}
                  </span>
                </span>
                <span className="text-muted-foreground line-clamp-2 text-xs whitespace-normal">
                  {selectedItem.description}
                </span>
              </span>
            </SelectValue>
          ) : (
            <SelectValue
              id={inputId}
              placeholder={`${placeholder}${required ? "*" : ""}`}
            />
          )}
        </SelectTrigger>

        <SelectContent
          align="start"
          side="bottom"
          className={cn(hasItemDescriptions && "max-w-md")}
        >
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {items.map((item) => (
              <SelectItem
                value={item.value}
                key={item.value}
                textValue={item.label}
                className={cn(item.description && "items-start py-2")}
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex min-w-0 items-center gap-2">
                    {item.icon}
                    <span className="truncate font-medium">{item.label}</span>
                  </span>
                  {item.description ? (
                    <span className="text-muted-foreground line-clamp-2 text-xs whitespace-normal">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

"use client";
import React, { forwardRef } from "react";
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
  Input,
} from "../ui";
import { cn } from "@/lib/utils";
import { InputFieldProps } from "@/types";

function InputFieldInner<T extends FieldValues, U extends Path<T>>(
  props: InputFieldProps<T, U>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    label,
    name,
    placeholder,
    showsDescription = true,
    description,
    required,
    showsLabel = true,
    orientation = "vertical",
    inputId: inputIdProp,
    renderInput,
    showsRequired = true,
    showsOptional = true,
    ...inputProps
  } = props;
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });
  const inputId = inputIdProp ?? field.name;

  return (
    <Field ref={ref} orientation={orientation}>
      <FieldContent>
        <FieldLabel
          className={cn("gap-0", !showsLabel && "sr-only", "")}
          htmlFor={inputId}
        >
          <span>
            {label}
            {required && showsRequired && (
              <span className="text-destructive">*</span>
            )}
            {!required && showsOptional && (
              <span className="text-muted-foreground text-sm"> (Optional)</span>
            )}
          </span>
        </FieldLabel>
        {description && (
          <FieldDescription
            className={cn("text-sm", !showsDescription && "sr-only")}
          >
            {description}
          </FieldDescription>
        )}
      </FieldContent>

      {renderInput ? (
        renderInput({ field, fieldState, inputId })
      ) : (
        <Input
          {...field}
          {...inputProps}
          aria-required={required}
          id={inputId}
          placeholder={placeholder}
          aria-invalid={fieldState.invalid}
        />
      )}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

export const InputField = forwardRef(InputFieldInner) as <
  T extends FieldValues,
  U extends Path<T>,
>(
  props: InputFieldProps<T, U> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;

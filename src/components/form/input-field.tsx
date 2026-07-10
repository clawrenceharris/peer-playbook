"use client";
import React, { forwardRef } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
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
    ...inputProps
  } = props;
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });
  const inputId = inputIdProp ?? field.name;

  return (
    <Field
      ref={ref}
      orientation={orientation}
      // className={cn(orientation === "responsive" && "@container/field-group")}
    >
      <FieldContent>
        <FieldLabel
          className={cn(!showsLabel && "sr-only", "")}
          htmlFor={inputId}
        >
          {label}
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
          placeholder={`${placeholder}${required ? "*" : " (Optional)"}`}
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

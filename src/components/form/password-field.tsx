import React, { useState } from "react";
import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
} from "../ui";
import {
  FieldValues,
  useController,
  Path,
  useFormContext,
} from "react-hook-form";
import { InputFieldProps } from "@/types";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField<T extends FieldValues, U extends Path<T>>({
  name,
  label,
  showsLabel = true,
  description,
  placeholder = "Enter your password",
  required,
  inputId: inputIdProp,
  ...inputProps
}: InputFieldProps<T, U>) {
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController<T, U>({ name, control });
  const inputId = inputIdProp || field.name;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field>
      <FieldLabel
        className={!showsLabel ? "sr-only" : "gap-0.5"}
        htmlFor={field.name}
      >
        {label}
      </FieldLabel>
      <div className="relative">
        <Input
          {...field}
          {...inputProps}
          id={inputId}
          type={showPassword ? "text" : "password"}
          disabled={field.disabled}
          placeholder={placeholder}
          aria-invalid={fieldState.invalid}
          aria-required={required}
        />

        <Button
          type="button"
          variant="link"
          size="icon"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((s) => !s)}
          className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center pr-3 text-gray-400 hover:text-gray-600 active:-translate-y-1/2!"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      <FieldError errors={[fieldState.error]} />
    </Field>
  );
}

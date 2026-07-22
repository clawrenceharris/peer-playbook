import { useState } from "react";
import {
  Field,
  FieldError,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui";
import {
  FieldValues,
  useController,
  Path,
  useFormContext,
} from "react-hook-form";
import { InputFieldProps } from "@/types";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function PasswordField<T extends FieldValues, U extends Path<T>>({
  name,
  label,
  showsLabel = true,
  showsRequired = true,
  showsOptional = true,
  placeholder = "Enter your password",
  required = true,
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
        className={cn("gap-0", !showsLabel && "sr-only", "")}
        htmlFor={field.name}
      >
        {label}
        {required && showsRequired ? (
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
        ) : (
          showsOptional &&
          !required && (
            <span className="text-muted-foreground text-sm font-normal">
              {" "}
              (Optional)
            </span>
          )
        )}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          {...field}
          {...inputProps}
          id={inputId}
          type={showPassword ? "text" : "password"}
          disabled={field.disabled}
          placeholder={placeholder}
          aria-invalid={fieldState.invalid}
          aria-required={required}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showPassword ? (
              <span className="sr-only">Hide password</span>
            ) : (
              <span className="sr-only">Show password</span>
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldError errors={[fieldState.error]} />
    </Field>
  );
}

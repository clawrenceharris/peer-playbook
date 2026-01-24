
import React, { useState } from 'react'
import { Button, Field, FieldContent, FieldDescription, FieldError, FieldLabel, Input } from '../ui'
import { Controller, FieldValues, useFormContext } from 'react-hook-form'
import { FieldProps } from '@/types'
import { Eye, EyeOff } from 'lucide-react';

export function PasswordField<T extends FieldValues>({
    name,
    label,
    showsLabel = true,
    rules,
    description,
    placeholder = "Password",
    shouldUnregister,
    defaultValue,
    isOptional,
    ...inputProps
}: FieldProps<T>) {
    const { control } = useFormContext<T>();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            shouldUnregister={shouldUnregister}
            defaultValue={defaultValue}

            render={({ field, fieldState }) => (
                <Field>
                    <FieldContent>

                   
                        <FieldLabel
                            className={!showsLabel ? "sr-only" : "gap-0.5"}
                            htmlFor={field.name}>
                            {label}
                        </FieldLabel>
                        <FieldDescription>
                            {description}
                        </FieldDescription>
                    </FieldContent>
                    <div className="relative">
                        <Input
                            {...field}
                            {...inputProps}
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            disabled={field.disabled}
                            placeholder={`${placeholder}${!isOptional ? "*" : ""}`}
                            aria-invalid={fieldState.invalid}
                            aria-required={!isOptional}
              
                        />
          
                        <Button
                            type="button"
                            variant="link"
                            size="icon"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-3 text-gray-400 hover:text-gray-600"
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
            )}
        />
    )
}

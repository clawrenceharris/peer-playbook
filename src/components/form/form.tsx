"use client";
import { type ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import {
  Button,
  DialogFooter,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldTitle,
  Spinner,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { BeforeUnload } from "@/components/form";
import { getUserErrorMessage } from "@/shared/utils";

export interface FormLayoutProps<T extends FieldValues> {
  children?: ((methods: UseFormReturn<T>) => ReactNode) | ReactNode;
  showsSubmitButton?: boolean;
  showsCancelButton?: boolean;
  submitText?: string;
  form: UseFormReturn<T>;
  cancelText?: string;
  title?: string;
  showsTitle?: boolean;
  titleClassName?: string;
  handleSubmit?: (data: T) => Promise<any> | any;
  onCancel?: () => void;
  onSubmitClick?: () => void;
  disabled?: boolean;
  loadingText?: string;
  description?: string;
  descriptionClassName?: string;
  enableBeforeUnloadProtection?: boolean;
  submitButtonClassName?: string;
  className?: string;
  showsDescription?: boolean;
  id?: string;
  isLoading?: boolean;
}

export function Form<T extends FieldValues>({
  children,
  form,
  loadingText = "Working on it...",
  showsSubmitButton = true,
  showsCancelButton = false,
  submitText = "Done",
  cancelText = "Cancel",
  title,
  titleClassName,
  showsTitle = true,
  handleSubmit: handleSubmitProp,
  onCancel,
  onSubmitClick,
  showsDescription = true,
  className,
  submitButtonClassName,
  description,
  descriptionClassName,
  enableBeforeUnloadProtection = true,
  id,
  isLoading,
  ...props
}: FormLayoutProps<T>) {
  const {
    clearErrors,
    setError,
    formState: { errors, disabled, isSubmitting, isDirty },
  } = form;
  const isDisabled = props.disabled || disabled || isLoading || isSubmitting;
  const handleSubmit = async (data: T) => {
    console.log(data);
    try {
      clearErrors();
      return await handleSubmitProp?.(data);
    } catch (error) {
      console.log(error);
      setError("root", { message: getUserErrorMessage(error) });
    }
  };
  console.log(errors);
  return (
    <BeforeUnload disabled={!isDirty || !enableBeforeUnloadProtection}>
      <FormProvider {...form}>
        <form
          id={id}
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn("flex w-full flex-1 flex-col", className)}
          aria-describedby={description}
        >
          <FieldGroup>
            <FieldContent>
              {title && (
                <FieldTitle
                  className={cn(
                    "font-heading text-3xl font-bold",
                    !showsTitle ? "sr-only" : "",
                    titleClassName,
                  )}
                >
                  {title}
                </FieldTitle>
              )}
              {description && showsDescription && (
                <FieldDescription className={descriptionClassName}>
                  {description}
                </FieldDescription>
              )}
            </FieldContent>
            {typeof children === "function" ? children(form) : children}

            {/* General Error */}

            {errors.root && (
              <FieldError className="text-destructive">
                {errors.root.message}
              </FieldError>
            )}

            <Field orientation="horizontal" className="w-full justify-end">
              {showsCancelButton && (
                <Button
                  disabled={isDisabled}
                  variant="outline"
                  type="button"
                  onClick={onCancel}
                >
                  {cancelText}
                </Button>
              )}

              {showsSubmitButton && (
                <Button
                  variant="primary"
                  type="submit"
                  onClick={onSubmitClick}
                  className={cn("flex-1", submitButtonClassName)}
                  disabled={isDisabled}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      {loadingText}
                      <Spinner
                        data-icon="inline-start"
                        strokeWidth={2.5}
                        className="size-5 animate-spin"
                      />
                    </span>
                  ) : (
                    submitText
                  )}
                </Button>
              )}
            </Field>
          </FieldGroup>
        </form>
      </FormProvider>
    </BeforeUnload>
  );
}

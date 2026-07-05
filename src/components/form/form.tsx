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
} from "@/components/ui";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BeforeUnload } from "@/components/form";
import { getUserErrorMessage, normalizeError } from "@/shared/utils";

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
  description?: string;
  descriptionClassName?: string;
  enableBeforeUnloadProtection?: boolean;
  submitButtonClassName?: string;
  className?: string;
  showsDescription?: boolean;
  isDialog?: boolean;
  id?: string;
  isLoading?: boolean;
}
type FormFooterProps = {
  showsCancelButton?: boolean;
  onCancel?: () => void;
  onSubmitClick?: () => Promise<any> | any;
  cancelText?: string;
  submitText?: string;
  showsSubmitButton?: boolean;
  submitButtonClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
};
function FormFooter({
  showsCancelButton,
  submitText,
  onCancel,
  onSubmitClick,
  cancelText,
  showsSubmitButton,
  submitButtonClassName,
  isLoading,
  disabled,
}: FormFooterProps) {
  return (
    <Field orientation="horizontal">
      {showsCancelButton && (
        <Button variant="outline" type="button" onClick={onCancel}>
          {cancelText}
        </Button>
      )}

      {showsSubmitButton && (
        <Button
          variant="primary"
          type="button"
          onClick={onSubmitClick}
          className={cn("flex-1", submitButtonClassName)}
          disabled={disabled}
        >
          {isLoading ? (
            <Loader2 strokeWidth={3} className="size-7 animate-spin" />
          ) : (
            submitText
          )}
        </Button>
      )}
    </Field>
  );
}

export function Form<T extends FieldValues>({
  children,
  form,
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
  isDialog,
  ...props
}: FormLayoutProps<T>) {
  const {
    clearErrors,
    setError,
    formState: { errors, disabled, isSubmitting, isDirty },
  } = form;
  const isDisabled = props.disabled || disabled || isLoading || isSubmitting;
  const handleSubmit = async (data: T) => {
    try {
      clearErrors();
      return await handleSubmitProp?.(data);
    } catch (error) {
      setError("root", { message: getUserErrorMessage(error) });
    }
  };
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
            <FieldContent className="space-y-3">
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

            {isDialog ? (
              <DialogFooter>
                <FormFooter
                  showsCancelButton={showsCancelButton}
                  submitText={submitText}
                  onCancel={onCancel}
                  onSubmitClick={onSubmitClick}
                  cancelText={cancelText}
                  showsSubmitButton={showsSubmitButton}
                  submitButtonClassName={submitButtonClassName}
                  isLoading={isLoading || isSubmitting}
                  disabled={isDisabled}
                />
              </DialogFooter>
            ) : (
              <FormFooter
                showsCancelButton={showsCancelButton}
                submitText={submitText}
                onCancel={onCancel}
                onSubmitClick={onSubmitClick}
                cancelText={cancelText}
                showsSubmitButton={showsSubmitButton}
                submitButtonClassName={submitButtonClassName}
                isLoading={isLoading || isSubmitting}
                disabled={isDisabled}
              />
            )}
          </FieldGroup>
        </form>
      </FormProvider>
    </BeforeUnload>
  );
}

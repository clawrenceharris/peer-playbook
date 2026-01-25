/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type FieldValues,
  type DefaultValues,
  type UseFormReturn,
} from "react-hook-form";
import { Button, FieldDescription, FieldError, FieldGroup } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { getUserErrorMessage } from "@/utils/error";
import { cn } from "@/lib/utils";
import { BeforeUnload } from "@/components/form";

export interface FormLayoutProps<T extends FieldValues>
  extends UseFormProps<T> {
  children?: ((methods: UseFormReturn<T>) => ReactNode) | ReactNode;
  showsSubmitButton?: boolean;
  showsCancelButton?: boolean;
  submitText?: string;
  cancelText?: string;
  onSubmit?: (data: T) => any | Promise<any>;
  onCancel?: () => void;
  onSuccess?: (data: T, result: any) => void;
  isLoading?: boolean;
  error?: string | null;
  description?: string;
  descriptionClassName?: string;
  defaultValues?: DefaultValues<T>;
  enableBeforeUnloadProtection?: boolean;
  submitButtonClassName?: string;
  className?: string;
  showsDescription?: boolean;
  id?: string;
}

export function Form<T extends FieldValues>({
  children,
  showsSubmitButton = true,
  showsCancelButton = false,
  submitText = "Done",
  cancelText = "Cancel",
  onSubmit,
  showsDescription,
  onCancel,
  resolver,
  className,
  onSuccess,
  submitButtonClassName,
  isLoading = false,
  mode = "onSubmit",
  description,
  descriptionClassName,
  enableBeforeUnloadProtection = false,
  id,
  ...formProps
}: FormLayoutProps<T>) {
  const form = useForm<T>({
    ...formProps,
    resolver,
    mode,
  });

  const handleSubmit = async (data: T) => {
    try {
      const r = await onSubmit?.(data);

      onSuccess?.(data, r);
    } catch (error) {
      console.error(error);
      form.setError("root", { message: getUserErrorMessage(error) });
    }
  };

  return (
    <BeforeUnload
      disabled={!form.formState.isDirty || !enableBeforeUnloadProtection}
    >
      <FormProvider {...form}>
        <form
          id={id}
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn("w-full h-full", className)}
          aria-describedby={description}
        >
         

         
          
          <FieldGroup className="relative h-full flex flex-col justify-between">
          {description && showsDescription && (
            <FieldDescription className={descriptionClassName}>
              {description}
            </FieldDescription>
          )}
            
            {/* General Error */}
            {form.formState.errors.root && (
                <FieldError errors={[form.formState.errors.root]} />
            )}
            {typeof children === "function" ? children(form) : children}

            <div className="justify-end flex">

            
                {showsCancelButton && (
                  <Button
                    size={"lg"}
                    variant={"link"}
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                )}

                {showsSubmitButton && (
              <Button
              
                    type="submit"
                    className={cn("flex-1",submitButtonClassName)}
                    size={"lg"}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      submitText
                    )}
                  </Button>
                )}
          </div>
          </FieldGroup>
        </form>
      </FormProvider>
    </BeforeUnload>
  );
}

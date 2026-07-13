import {
  updatePasswordSchema,
  type UpdatePasswordFormValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordAction as resetPasswordAction } from "@/actions/auth/commands";
import { useState } from "react";
export const useResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const resetPassword = async ({ password }: UpdatePasswordFormValues) => {
    setIsLoading(true);
    const result = await resetPasswordAction(password);
    if (!result.success) {
      setIsLoading(false);
      throw result.error;
    }
    setSuccess(true);
    setIsLoading(false);
  };

  return { form, resetPassword, isLoading, success };
};

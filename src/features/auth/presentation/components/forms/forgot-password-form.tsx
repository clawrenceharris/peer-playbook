"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import Link from "next/link";
import { Form, InputField } from "@/components/form";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation";
import { useRequestPasswordResetForm } from "../../hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Send } from "lucide-react";

export function ForgotPasswordForm() {
  const { form, requestPasswordReset, isLoading, success } =
    useRequestPasswordResetForm();

  return (
    <>
      {success ? (
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-2">
            <p className="bg-success-100 text-success-500 inline-flex items-center gap-2 rounded-full py-2 pr-4 pl-2 text-sm">
              <Send className="h-4 w-4" />
              Password reset instructions sent
            </p>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground text-sm">
              If you registered using your email and password, you will receive
              a password reset email.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <Form<ForgotPasswordFormValues>
          enableBeforeUnloadProtection={false}
          title="Reset Your Password"
          description="Type in your email and we'll send you a link to reset your password"
          form={form}
          isLoading={isLoading}
          handleSubmit={requestPasswordReset}
          showsCancelButton={false}
        >
          <InputField<ForgotPasswordFormValues, "email">
            name="email"
            label="Email"
            placeholder="Enter your email address"
            required
          />
        </Form>
      )}
    </>
  );
}

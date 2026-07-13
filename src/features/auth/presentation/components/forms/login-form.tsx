"use client";
import { FieldGroup } from "@/components/ui";
import { Form, InputField } from "@/components/form";
import Link from "next/link";
import { loginSchema, type LoginFormValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/providers/auth-provider";
import { useForm } from "react-hook-form";
import { PasswordField } from "@/components/form/password-field";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <Form<LoginFormValues>
      form={form}
      isLoading={isLoading}
      enableBeforeUnloadProtection={false}
      showsCancelButton={false}
      submitText="Log In"
      handleSubmit={login}
      titleClassName="text-3xl tracking-wide font-primary-heading"
      title="Welcome back!"
      description="Sign back in to your account to continue studying."
    >
      <FieldGroup>
        {/* Email */}
        <InputField<LoginFormValues, "email">
          name="email"
          placeholder="Enter your email address"
          label="Email"
          required
          autoComplete="current-email"
        />

        {/* Password */}
        <div className="space-y-2">
          <PasswordField<LoginFormValues, "password">
            label="Password"
            name="password"
            autoComplete="current-password"
            required
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="ml-auto inline-block text-sm font-medium underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </FieldGroup>
    </Form>
  );
}

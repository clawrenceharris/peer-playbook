"use client";
import { FieldGroup } from "@/components/ui";
import { Form, InputField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormValues } from "@/lib/validation";
import { useAuth } from "@/components/providers/auth-provider";
import { useForm } from "react-hook-form";
import { PasswordField } from "@/components/form/password-field";

export function SignupForm() {
  const { signup, isLoading } = useAuth();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });
  return (
    <Form<SignUpFormValues>
      form={form}
      isLoading={isLoading}
      enableBeforeUnloadProtection={false}
      id="signup-form"
      submitText="Create Account"
      handleSubmit={signup}
      title="Get Started"
      description="Let's get the ball rolling! Create an account to start practicing your social skills."
      showsDescription={true}
    >
      <FieldGroup>
        {/* Email */}
        <InputField<SignUpFormValues, "email">
          name="email"
          placeholder="Enter your email address"
          label="Email"
          autoComplete="email"
          required
        />

        {/* Password */}
        <PasswordField<SignUpFormValues, "password">
          name="password"
          label="Password"
          autoComplete="new-password"
          required
        />
      </FieldGroup>
    </Form>
  );
}

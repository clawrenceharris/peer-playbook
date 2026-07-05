"use client";
import { FieldGroup } from "@/components/ui";
import { Form, InputField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormValues } from "@/lib/validation";
import { useAuth } from "@/components/providers/auth-provider";
import { useForm } from "react-hook-form";

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
        <InputField<SignUpFormValues, "password">
          name="password"
          label="Password"
          placeholder={"Enter your password"}
          autoComplete="new-password"
          type="password"
          required
        />
      </FieldGroup>
    </Form>
  );
}

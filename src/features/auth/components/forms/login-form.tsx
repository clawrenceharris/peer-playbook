import { FieldGroup } from "@/components/ui";
import { LoginFormInput, loginSchema } from "@/features/auth/domain";
import { Form, InputField, PasswordField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  return (
    <Form<LoginFormInput>
      isLoading={isLoading}
      showsCancelButton={false}
      showsDescription={true}
      description="Enter your email below to login to your account"
      submitText="Log In"
      defaultValues={{email: "", password: ""}}
      resolver={zodResolver(loginSchema)}
      onSubmit={login}
      >
      
        <FieldGroup>
          {/* Email */}
          <InputField<LoginFormInput>
            name="email"
            placeholder="Email"
            label="Email"
          />

          {/* Password */}
          <div className="space-y-2">
            <PasswordField label="Password" name="password" />
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="ml-auto font-medium inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>     
        </FieldGroup>   
    </Form>
  );
}
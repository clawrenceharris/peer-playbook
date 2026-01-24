import { FieldGroup } from "@/components/ui";
import { LoginFormInput, loginSchema } from "@/features/auth/domain";
import { Form, FormLayoutProps, InputField, PasswordField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

export function LoginForm({...props}: FormLayoutProps<LoginFormInput>) {
 
  return (
    <Form<LoginFormInput>
      showsCancelButton={false}
      showsDescription={false}
      description="Enter your email below to login to your account"
      submitText="Log In"
      submitButtonClassName="sticky bottom-0 flex-1"
      resolver={zodResolver(loginSchema)}
      {...props}>
      
        <FieldGroup>
          {/* Email */}
          <InputField<LoginFormInput>
            name="email"
            placeholder="Email"
            label="Email"
            defaultValue=""
          />

          {/* Password */}
          <div className="space-y-2">
            <PasswordField defaultValue="" label="Password" name="password" />
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
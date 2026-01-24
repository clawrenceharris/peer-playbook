import { FieldGroup } from "@/components/ui";
import { SignUpFormInput, signUpSchema } from "@/features/auth/domain";
import { Form, InputField, PasswordField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/hooks";

export function SignUpForm() {
  const { signup, isLoading } = useAuth();

  return (
    <Form<SignUpFormInput>
      showsCancelButton={false}
      submitButtonClassName="flex-1"
      submitText="Sign Up"
      description="Sign up to begin enhancing your SI workflow!"
      resolver={zodResolver(signUpSchema)}
      isLoading={isLoading}
      onSubmit={signup}
    >
   
      <FieldGroup>
        {/* Name */}
        <div className="flex flex-col items-start md:flex-row gap-5">
          <InputField<SignUpFormInput>
            name="firstName"
            placeholder="First name"
            label="First name"
            defaultValue=""
          />
          <InputField<SignUpFormInput>
            name="lastName"
            placeholder="Last name"
            isOptional
            label="Last name"
            defaultValue=""
          />
        </div>

          {/* Email */}
          <InputField<SignUpFormInput>
            name="email"
            placeholder="Email"
            label="Email"
            defaultValue=""
          />

          {/* Password */}
        <PasswordField<SignUpFormInput>
          name="password"
          defaultValue=""
          description="Choose a strong password to log in to your account"
          
          label="Password"  />
      </FieldGroup>
    </Form>
  )
}
  

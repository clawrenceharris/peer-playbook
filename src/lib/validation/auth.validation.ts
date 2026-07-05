import z from "zod";

export const password = z.string()
.min(8, "Password must be at least 8 characters long")


export const email = z.email("Please enter a valid email address")

export const signUpSchema = z.object({
  firstName: z.string("Please enter your first name"),
  lastName: z.string().optional(),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string(),
});

export const updatePasswordSchema = z.object({
  password,
});

export const forgotPasswordSchema = z.object({
  email,
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

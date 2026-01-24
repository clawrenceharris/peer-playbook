import z from "zod";
import { forgotPasswordSchema, loginSchema, signUpSchema, updatePasswordSchema } from "./";

export type SignUpFormInput = z.infer<typeof signUpSchema>;
export type LoginFormInput = z.infer<typeof loginSchema>;
export type UpdatePasswordFormInput = z.infer<typeof updatePasswordSchema>;
export type ForgotPasswordFormInput = z.infer<typeof forgotPasswordSchema>;

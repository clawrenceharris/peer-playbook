import { email, password } from "@/utils/schema-helpers";
import z from "zod";

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

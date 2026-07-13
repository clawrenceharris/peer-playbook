import z from "zod";

export const createProfileSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name."),
  courses: z.string().array().optional(),
  lastName: z
    .string()
    .refine(
      (val) => val.length <= 20,
      "Last name is too long. Try entering just your last initial.",
    )
    .optional(),
  avatarFile: z.instanceof(File).nullable().optional(),
});
export const updateProfileSchema = createProfileSchema.partial();

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type CreateProfileFormValues = z.infer<typeof createProfileSchema>;

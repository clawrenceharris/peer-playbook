import z from "zod";

// Base profile schema with common fields
export const profileSchema = z.object({
  firstName: z.string(),
  coursesInstructed: z.string().array().optional().default([]),
  lastName: z
    .string()
    .min(1)
    .max(20, "Last name is too long. Try entering just your initials.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  avatarUrl: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});


// Base profile schema with common fields
export const updateProfileSchema = profileSchema.partial();
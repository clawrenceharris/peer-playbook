import { z } from "zod";

export const createSessionSchema = z.object({
  playbookId: z.uuid().optional().nullable(),
  title: z.string().min(1, "Please enter a title"),
  topic: z.string().optional(),
  courseName: z.string().optional(),
  description: z.string().optional(),
  subject: z.string().optional(),
  mode: z.enum(["in-person", "virtual", "hybrid"]),
  scheduledStart: z.string(),
});
export const updateSessionSchema = z.object({
  title: z.string().min(1, "Please enter a title").optional(),
  topic: z.string().optional(),
  courseName: z.string().optional(),
  mode: z.enum(["in-person", "virtual", "hybrid"]).optional(),
  scheduledStart: z.string().optional(),
});
export type CreateSessionFormValues = z.input<typeof createSessionSchema>;
export type UpdateSessionFormValues = z.infer<typeof updateSessionSchema>;

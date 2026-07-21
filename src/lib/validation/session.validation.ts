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
export const updateSessionSchema = createSessionSchema.partial();
export type CreateSessionFormValues = z.input<typeof createSessionSchema>;
export type UpdateSessionFormValues = z.infer<typeof updateSessionSchema>;

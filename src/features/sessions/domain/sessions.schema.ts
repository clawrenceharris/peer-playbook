import z from "zod";

export const createSessionSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  playbookId: z.string().optional(),
  topic: z.string().min(1, "Topic is required"),
  description: z.string().optional(),
  status: z.enum(["active", "completed", "canceled", "scheduled"]),
  subject: z.enum(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@/types/database").Constants.public.Enums.course_subject,
    "Subject is required"
  ),
  mode: z.enum(["in-person", "virtual", "hybrid"]).optional(),
  scheduledStart: z.string().min(1, "Start date is required"),
});


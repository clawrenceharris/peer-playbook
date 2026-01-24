import { z } from "zod";

export const generatePlaybookSchema = z.object({
  subject: z.string("Please select a subject"),
  courseName: z.string("Please enter the course name"),
  topic: z.string("Please enter a topic"),
  instructions: z.string(),
  contexts: z.array(z.string()),
  modes: z.array(z.string()),
});

export const updatePlaybookSchema = z.object({
  courseName: z.string().min(1, "Course name is required").optional(),
  topic: z.string().min(1, "Topic is required").optional(),
  subject: z.string().optional(),
});

export type GeneratePlaybookFormValues = z.infer<typeof generatePlaybookSchema>;
export type GeneratePlaybookInput = GeneratePlaybookFormValues;
export type UpdatePlaybookFormInput = z.infer<typeof updatePlaybookSchema>;

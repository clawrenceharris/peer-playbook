import { GeneratePlaybookFormValues } from "@/lib/validation";

export type GeneratePlaybookInput = {
  userId: string;
} & GeneratePlaybookFormValues;

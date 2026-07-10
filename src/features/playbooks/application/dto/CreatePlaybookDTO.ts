import { CreatePlaybookFormValues } from "@/lib/validation";

export type CreatePlaybookInput = {
  userId: string;
} & CreatePlaybookFormValues;

export type CreatePlaybookResult = {
  id: string;
  topic: string;
};

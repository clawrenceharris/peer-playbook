import { BuildPlaybookFormValues } from "@/lib/validation";

export type CreatePlaybookInput = {
  userId: string;
} & BuildPlaybookFormValues;

export type CreatePlaybookResult = {
  id: string;
  topic: string;
};

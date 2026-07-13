import { UpdatePlaybookFormValues } from "@/lib/validation";

export type UpdatePlaybookInput = {
  id: string;
} & UpdatePlaybookFormValues;

export type UpdatePlaybookResult = {
  id: string;
};

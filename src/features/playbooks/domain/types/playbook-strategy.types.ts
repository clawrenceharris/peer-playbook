import { UpdatePlaybookStrategyFormValues } from "@/lib/validation";

export type UpdatePlaybookStrategyCommand = {
  steps?: string[];
  title?: string;
  phase?: string;
  resources?: string[];
};

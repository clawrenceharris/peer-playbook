import { UpdatePlaybookStrategyFormValues } from "@/lib/validation";

export type UpdatePlaybookStrategyInput = {
  strategyId: string;
  playbookId?: string;
  slug?: string;
  category?: string;
} & UpdatePlaybookStrategyFormValues;

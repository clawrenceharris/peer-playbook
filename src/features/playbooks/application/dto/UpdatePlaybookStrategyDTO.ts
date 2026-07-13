import { UpdatePlaybookStrategyFormValues } from "@/lib/validation";

export type UpdatePlaybookStrategyInput = {
  strategyId: string;
  playbookId?: string;
  cardSlug?: string;
  category?: string;
} & UpdatePlaybookStrategyFormValues;

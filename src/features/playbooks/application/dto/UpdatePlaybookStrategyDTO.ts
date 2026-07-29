export type UpdatePlaybookStrategyInput = {
  strategyId: string;
  playbookId?: string;
  slug?: string;
  category?: string;
  steps?: string[];
  title?: string;
  phase?: "warmup" | "workout" | "closer";
  position?: number;
  description?: string;
  sourceId?: string;
  sourceType?: string;
  facilitatorNotes?: string | null;
  estimatedMinutes?: number | null;
};

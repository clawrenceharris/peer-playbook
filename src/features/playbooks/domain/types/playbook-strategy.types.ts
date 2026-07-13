export type UpdatePlaybookStrategyCommand = {
  steps?: string[];
  title?: string;
  cardSlug?: string;
  category?: string;
  phase?: string;
  position?: number;
  description?: string;
  sourceId?: string;
  sourceType?: string;
};

export type CreatePlaybookStrategyCommand = {
  playbookId: string;
  playbookPhaseId: string;
  cardSlug: string;
  category: string;
  title: string;
  description: string;
  steps: string[];
  phase: "warmup" | "workout" | "closer";
  position: number;
  sourceId: string;
  sourceType: "system" | "user";
};

export type RemovePlaybookStrategyCommand = {
  playbookId: string;
  strategyId: string;
};

export type AddPlaybookStrategyInput = {
  playbookId: string;
  playbookPhaseId: string;
  title: string;
  cardSlug: string;
  category: string;
  steps: string[];
  description: string;
  phase: "warmup" | "workout" | "closer";
  position: number;
  sourceId: string;
  sourceType: "system" | "user";
};


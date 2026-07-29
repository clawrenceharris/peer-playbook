export type PlaybookStrategy = {
  id: string;
  title: string;
  slug: string;
  phase: "warmup" | "workout" | "closer";
  playbookPhaseId: string | null;
  category: string;
  sourceId: string | null;
  sourceType: string | null;
  position: number;
};

export type UpdatePlaybookStrategyCommand = {
  steps?: string[];
  title?: string;
  slug?: string;
  category?: string;
  phase?: string;
  position?: number;
  description?: string;
  sourceId?: string;
  sourceType?: string;
  facilitatorNotes?: string | null;
  estimatedMinutes?: number | null;
};

export type CreatePlaybookStrategyCommand = {
  playbookId: string;
  playbookPhaseId: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  steps: string[];
  phase: "warmup" | "workout" | "closer";
  position: number;
  sourceId: string;
  sourceType: "system" | "user";
  facilitatorNotes?: string | null;
  estimatedMinutes?: number | null;
};

export type RemovePlaybookStrategyCommand = {
  playbookId: string;
  strategyId: string;
};

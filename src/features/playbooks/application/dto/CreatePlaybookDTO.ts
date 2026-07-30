export type PlaybookMode = "in-person" | "virtual" | "hybrid";

export type PlaybookStrategyReferenceInput = {
  sourceType: "system" | "user";
  sourceId: string;
};

export type CreatePlaybookPhaseInput = {
  title: string;
  intentKey: "activate" | "explore" | "apply" | "reflect";
  templatePhaseKey?: string;
  legacyPhase: "warmup" | "workout" | "closer";
  position: number;
  strategies: PlaybookStrategyReferenceInput[];
};

export type CreatePlaybookInput = {
  userId: string;
  title: string;
  topic: string;
  subject?: string;
  courseName?: string;
  contexts: string[];
  modes: PlaybookMode[];
  instructionalModelId?: string;
  warmup: PlaybookStrategyReferenceInput[];
  workout: PlaybookStrategyReferenceInput[];
  closer: PlaybookStrategyReferenceInput[];
  phases: CreatePlaybookPhaseInput[];
};

export type CreatePlaybookResult = {
  id: string;
  topic: string;
};

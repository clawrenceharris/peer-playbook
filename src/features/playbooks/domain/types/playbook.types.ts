export type UpdatePlaybookCommand = {
  topic?: string;
  courseName?: string;
  subject?: string;
  methodology?: string;
};

export type CreatePlaybookCommand = {
  topic: string;
  courseName: string | null;
  methodology: string | null;
  instructionalModelId?: string;
  contexts: string[];
  subject: string;
  modes: ("in-person" | "virtual" | "hybrid")[];
  createdBy: string;
  phases?: CreatePlaybookPhaseCommand[];
};

export type GeneratePlaybookCommand = {
  instructions: string;
  contexts: string[];
} & CreatePlaybookCommand;

export type CreatePlaybookStrategyRef = {
  sourceType: "system" | "user";
  sourceId: string;
};

export type CreatePlaybookPhaseCommand = {
  title: string;
  intentKey: "activate" | "explore" | "apply" | "reflect";
  templatePhaseKey?: string;
  legacyPhase: "warmup" | "workout" | "closer";
  position: number;
  strategies: CreatePlaybookStrategyRef[];
};

export type UpdatePlaybookPhaseCommand = {
  id: string;
  title: string;
  intentKey: "activate" | "explore" | "apply" | "reflect";
  position: number;
};

export type UpdatePlaybookPhasesCommand = {
  playbookId: string;
  phases: UpdatePlaybookPhaseCommand[];
};

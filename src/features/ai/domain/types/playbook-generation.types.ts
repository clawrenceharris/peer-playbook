export type AiStrategyCatalogItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string | null;
  goodFor: string[];
};

export type AiInstructionalContext = {
  key: string;
  title: string;
  description: string;
  bullets: string[];
};

export type PlaybookGenerationRequest = {
  title: string;
  subject: string;
  topic: string;
  courseName?: string | null;
  contexts: string[];
  modes: ("in-person" | "virtual" | "hybrid")[];
  instructions: string;
};

export type GeneratedPlaybookStrategy = {
  slug: string;
  phase: "warmup" | "workout" | "closer";
  rationale?: string;
};

export type GeneratedPlaybookPlan = {
  strategies: GeneratedPlaybookStrategy[];
};

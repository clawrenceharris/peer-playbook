export type AddPlaybookStrategyInput = {
  playbookId: string;
  playbookPhaseId: string;
  title: string;
  slug: string;
  category: string;
  steps: string[];
  description: string;
  phase: "warmup" | "workout" | "closer";
  position: number;
  sourceId: string;
  sourceType: "system" | "user";
  facilitatorNotes?: string | null;
  estimatedMinutes?: number | null;
};

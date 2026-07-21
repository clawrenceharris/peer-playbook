import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

export type AddPlaybookPhaseInput = {
  playbookId: string;
  title: string;
  position: number;
  estimatedMinutes: number | null;
  description: string | null;
  objective: string | null;
  intent: PhaseIntent;
};

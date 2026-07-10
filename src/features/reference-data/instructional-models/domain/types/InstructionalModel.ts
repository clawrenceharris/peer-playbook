import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

export type InstructionalModelPhase = {
  key: string;
  label: string;
  description: string;
  intent: PhaseIntent;
  position: number;
};

export type InstructionalModel = {
  id: string;
  label: string;
  goodFor: string;
  description: string;
  phases: InstructionalModelPhase[];
  supportsCustomPhases: boolean;
};

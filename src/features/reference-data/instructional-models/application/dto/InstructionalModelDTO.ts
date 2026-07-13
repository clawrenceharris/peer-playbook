export type InstructionalModelIntentKey =
  | "activate"
  | "explore"
  | "apply"
  | "reflect";

export type InstructionalModelPhaseDTO = {
  key: string;
  label: string;
  description: string;
  intentKey: InstructionalModelIntentKey;
  position: number;
};

export type InstructionalModelDTO = {
  id: string;
  label: string;
  description: string;
  supportsCustomPhases: boolean;
  phases: InstructionalModelPhaseDTO[];
};

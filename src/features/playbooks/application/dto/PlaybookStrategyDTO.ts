export type PlaybookStrategyCardDTO = {
  id: string;
  title: string;
  phase: string;
  playbookPhaseId?: string | null;
};

export type PlaybookStrategyDetailDTO = {
  id: string;
  title: string;
  phase: string;
  playbookPhaseId: string | null;
  steps: string[];
  resources: string[];
  createdAt: Date;
  updatedAt: Date | null;
};

export type PlaybookStrategyCardDTO = {
  id: string;
  title: string;
  slug: string;
  phase: string;
  playbookPhaseId?: string | null;
  category?: string;
  sourceId?: string | null;
  sourceType?: string | null;
  position?: number;
};

export type PlaybookStrategyDetailDTO = {
  id: string;
  slug: string;
  title: string;
  phase: string;
  playbookPhaseId: string | null;
  category?: string;
  sourceId?: string | null;
  sourceType?: string | null;
  position?: number;
  steps: string[];
  facilitatorNotes: string | null;
  estimatedMinutes: number | null;
  resources: string[];
  createdAt: Date;
  updatedAt: Date | null;
};

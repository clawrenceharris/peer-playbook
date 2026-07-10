export type PlaybookStrategyDetailSelection = {
  id: string;
  title: string;
  phase: string;
  playbook_phase_id: string | null;
  steps: string[];
  created_at: Date;
  updated_at: Date | null;
};

export type PlaybookStrategyCardSelection = Pick<
  PlaybookStrategyDetailSelection,
  "id" | "title" | "phase" | "playbook_phase_id" | "created_at" | "updated_at"
>;

export const playbookStrategyDetailSelection =
  {} as PlaybookStrategyDetailSelection;
export const playbookStrategyCardSelection =
  {} as PlaybookStrategyCardSelection;

export type PlaybookPhaseDetailSelection = {
  id: string;
  playbook_id: string;
  title: string;
  description: string | null;
  objective: string | null;
  estimated_minutes: number | null;
  position: number;
  phase_intents: {
    id: string;
    key: string;
    label: string;
    description: string;
    color_token: string;
    icon_name: string | null;
    sort_order: number;
  };
};

export const playbookPhaseDetailSelection =
  {} as PlaybookPhaseDetailSelection;

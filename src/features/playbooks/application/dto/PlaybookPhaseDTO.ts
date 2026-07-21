export type PlaybookPhaseDTO = {
  id: string;
  title: string;
  position: number;
  estimatedMinutes: number | null;
  description: string | null;
  objective: string | null;
  intent: {
    id: string;
    key: "activate" | "explore" | "apply" | "reflect";
    title: string;
    description: string;
    sortOrder: number;
  };
};

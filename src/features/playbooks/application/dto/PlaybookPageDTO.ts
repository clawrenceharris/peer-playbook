import { PlaybookDetailDTO } from "./PlaybookDTO";
import { PlaybookStrategyDetailDTO } from "./PlaybookStrategyDTO";
import { UserSummaryDTO } from "@/shared/application";

export type GetPlaybookPageOutput = {
  playbook: {
    id: string;
    courseName: string | null;
    methodology: string | null;
    subject: string | null;
    title: string;
    topic: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    phases: PlaybookPagePhaseDTO[];
    sessions: {
      id: string;
    }[];
    creator: UserSummaryDTO;
  };
  strategies: PlaybookStrategyDetailDTO[];
};

export type PlaybookPagePhaseDTO = {
  id: string;
  title: string;
  position: number;
  intent: {
    id: string;
    key: "activate" | "explore" | "apply" | "reflect";
    title: string;
    sortOrder: number;
  };
  estimatedMinutes: number | null;
  objective: string | null;
};

export type GetPlaybookPageInput = {
  playbook: PlaybookDetailDTO;
  strategies: PlaybookStrategyDetailDTO[];
  creator: UserSummaryDTO;
  phases?: PlaybookPagePhaseDTO[];
  sessions?: { id: string }[];
};

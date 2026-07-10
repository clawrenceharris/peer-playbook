import { PlaybookDetailDTO } from "./PlaybookDTO";
import { PlaybookStrategyDetailDTO } from "./PlaybookStrategyDTO";

export type PlaybookPageCreatorDTO = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};

export type GetPlaybookPageOutput = {
  playbook: {
    id: string;
    courseName: string | null;
    methodology: string | null;
    subject: string;
    topic: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    phases: PlaybookPagePhaseDTO[];
    sessions: {
      id: string;
    }[];
    creator: PlaybookPageCreatorDTO;
  };
  strategies: PlaybookStrategyDetailDTO[];
};

export type PlaybookPagePhaseDTO = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  intent: {
    id: string;
    key: string;
    label: string;
    colorToken: string;
    iconName: string | null;
    description: string;
    sortOrder: number;
  };
  estimatedMinutes: number | null;
  objective: string | null;
};

export type PlaybookPagePlaybookDTO = {
  phases: PlaybookPagePhaseDTO[];
  strategies: PlaybookStrategyDetailDTO[];
  creator: PlaybookPageCreatorDTO;
} & PlaybookDetailDTO;

export type GetPlaybookPageInput = {
  playbook: PlaybookDetailDTO;
  strategies: PlaybookStrategyDetailDTO[];
  creator: PlaybookPageCreatorDTO;
  phases?: PlaybookPagePhaseDTO[];
  sessions?: { id: string }[];
};

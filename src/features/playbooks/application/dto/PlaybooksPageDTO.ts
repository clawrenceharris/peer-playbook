import { PlaybookCardDTO } from "./PlaybookDTO";

export type PlaybooksPageOutput = {
  playbooks: PlaybooksPagePlaybookCardDTO[];
};
export type PlaybooksPagePlaybookCardDTO = {
  creator: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
} & PlaybookCardDTO;
export type PlaybookPageInput = {
  userId: string;
  playbooks: PlaybooksPagePlaybookCardDTO[];
};

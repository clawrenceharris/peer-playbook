import { PlaybookCardDTO } from "./PlaybookDTO";
import { UserSummaryDTO } from "@/shared/application";

export type PlaybooksPageOutput = {
  playbooks: PlaybooksPagePlaybookCardDTO[];
};
export type PlaybooksPagePlaybookCardDTO = {
  creator: UserSummaryDTO;
} & PlaybookCardDTO;
export type PlaybookPageInput = {
  userId: string;
  playbooks: PlaybooksPagePlaybookCardDTO[];
};

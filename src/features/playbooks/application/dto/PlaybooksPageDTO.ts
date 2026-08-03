import { PlaybookCardDTO } from "./PlaybookDTO";
import { UserSummaryDTO } from "@/shared/application";

export type PlaybooksPageOutput = {
  playbooks: PlaybookSummaryDTO[];
};
export type PlaybookSummaryDTO = {
  creator: UserSummaryDTO;
} & PlaybookCardDTO;
export type GetPlaybooksPageInput = {
  userId: string;
  playbooks: PlaybookSummaryDTO[];
};

import { PlaybookMode } from "./CreatePlaybookDTO";

export type GeneratePlaybookInput = {
  userId: string;
  title: string;
  topic: string;
  subject?: string;
  courseName?: string;
  contexts: string[];
  modes: PlaybookMode[];
  instructions: string;
};

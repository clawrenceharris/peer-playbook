import { PlaybookStrategyCardDTO } from "./PlaybookStrategyDTO";

export type PlaybookDetailDTO = {
  id: string;
  methodology: string | null;
  createdAt: Date;
  courseName: string | null;
  subject: string | null;
  title: string;
  topic: string;
  published: boolean;
  updatedAt: Date | null;
  createdBy: string;
  strategies: PlaybookStrategyCardDTO[];
};

export type PlaybookCardDTO = {
  id: string;
  updatedAt: Date | null;
  published: boolean;
  createdAt: Date;
  courseName: string | null;
  subject: string | null;
  title: string;
  topic: string;
  createdBy: string | null;
};

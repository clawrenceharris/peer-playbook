export type PlaybookDetailDTO = {
  id: string;
  methodology: string | null;
  createdAt: Date;
  courseName: string | null;
  subject: string;
  topic: string;
  published: boolean;
  updatedAt: Date | null;
  createdBy: string;
};

export type PlaybookCardDTO = {
  id: string;
  updatedAt: Date | null;
  published: boolean;
  createdAt: Date;
  courseName: string | null;
  subject: string;
  topic: string;
  createdBy: string | null;
};

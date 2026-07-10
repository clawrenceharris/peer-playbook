export type PlaybookDetailSelection = {
  id: string;
  topic: string;
  course_name: string | null;
  subject: string;
  createdBy: string;
  created_at: Date;
  updated_at: Date | null;
  published: boolean | null;
};

export type PlaybookCardSelection = PlaybookDetailSelection;

export const playbookDetailSelection = {} as PlaybookDetailSelection;
export const playbookCardSelection = {} as PlaybookCardSelection;

import { SessionMode, SessionStatus } from "../value-objects";

export type CreateSessionCommand = {
  playbookId: string | null;
  instructorId: string;
  title: string;
  scheduledStart: string;
  mode: SessionMode;
  subject: string | null;
  topic: string | null;
  courseName: string | null;
  description: string | null;
  status: SessionStatus;
};

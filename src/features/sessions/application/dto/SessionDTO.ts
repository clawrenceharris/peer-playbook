import { SessionMode, SessionStatus } from "../../domain/value-objects";

export type SessionDetailDTO = {
  id: string;
  playbookId: string | null;
  title: string;
  scheduledStart: string;
  mode: SessionMode;
  subject: string | null;
  topic: string | null;
  courseName: string | null;
  description: string | null;
  status: SessionStatus;
};

export type SessionCardDTO = {
  id: string;
  playbookId: string | null;
  title: string;
  scheduledStart: string;
  mode: SessionMode;
  subject: string | null;
  topic: string | null;
  courseName: string | null;
  description: string | null;
  status: SessionStatus;
};

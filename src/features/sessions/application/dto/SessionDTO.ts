import { SessionMode, SessionStatus } from "../../domain/value-objects";

export type SessionDetailDTO = {
  id: string;
  sessionCode: string | null;
  playbookId: string | null;
  title: string;
  scheduledStart: string;
  mode: SessionMode;
  subject: string | null;
  topic: string | null;
  courseName: string | null;
  description: string | null;
  status: SessionStatus;
  createdAt: string;
};

export type SessionCardDTO = {
  id: string;
  sessionCode: string | null;
  playbookId: string | null;
  title: string;
  scheduledStart: string;
  mode: SessionMode;
  subject: string | null;
  topic: string | null;
  courseName: string | null;
  description: string | null;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
};

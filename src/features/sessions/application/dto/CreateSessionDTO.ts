export type SessionDeliveryMode = "in-person" | "virtual" | "hybrid";

export type CreateSessionInput = {
  instructorId: string;
  playbookId?: string | null;
  title: string;
  topic?: string;
  courseName?: string;
  description?: string;
  subject?: string;
  mode: SessionDeliveryMode;
  scheduledStart: string;
};

export type CreateSessionResult = {
  id: string;
};

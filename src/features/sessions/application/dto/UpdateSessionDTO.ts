import { SessionDeliveryMode } from "./CreateSessionDTO";

export type UpdateSessionInput = {
  sessionId: string;
  title?: string;
  topic?: string;
  courseName?: string;
  scheduledStart?: string;
  mode?: SessionDeliveryMode;
};

export type UpdateSessionResult = {
  instructorId: string;
  sessionId: string;
};

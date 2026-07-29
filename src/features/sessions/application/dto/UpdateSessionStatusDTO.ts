import { SessionStatus } from "@/features/sessions/domain/value-objects";

export interface UpdateSessionStatusInput {
  sessionId: string;
  status: string;
}

export interface UpdateSessionStatusResult {
  code: string;
  id: string;
  instructorId: string;
  status: SessionStatus;
}

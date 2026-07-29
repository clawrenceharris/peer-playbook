import { SessionStatus } from "../value-objects";

export interface UpdateSessionStatusCommand {
  sessionId: string;
  status: SessionStatus;
}

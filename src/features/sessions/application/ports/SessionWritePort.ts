import {
  CreateSessionResult,
  UpdateSessionResult,
  UpdateSessionStatusResult,
} from "../dto";
import {
  CreateSessionCommand,
  UpdateSessionCommand,
  UpdateSessionStatusCommand,
} from "../../domain/types";

export interface SessionWritePort {
  deleteSession(sessionId: string): Promise<void>;
  updateSessionStatus(
    data: UpdateSessionStatusCommand,
  ): Promise<UpdateSessionStatusResult>;
  createSession(data: CreateSessionCommand): Promise<CreateSessionResult>;
  updateSession(
    sessionId: string,
    data: UpdateSessionCommand,
  ): Promise<UpdateSessionResult>;
}

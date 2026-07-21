import { CreateSessionResult } from "../../application/dto";
import { CreateSessionCommand } from "../types";

export interface SessionWriteRepository {
  createSession(data: CreateSessionCommand): Promise<CreateSessionResult>;
}

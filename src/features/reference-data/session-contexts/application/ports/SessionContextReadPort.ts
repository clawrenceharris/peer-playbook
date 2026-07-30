import { SessionContextDTO } from "../dto/SessionContextDTO";

export interface SessionContextReadPort {
  findAll(): Promise<SessionContextDTO[]>;
  findByKey(key: string): Promise<SessionContextDTO>;
}

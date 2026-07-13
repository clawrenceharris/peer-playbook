import { SessionContextDTO } from "../../application/dto/SessionContextDTO";

export interface SessionContextRepository {
  findAll(): Promise<SessionContextDTO[]>;
  findByKey(key: string): Promise<SessionContextDTO>;
}

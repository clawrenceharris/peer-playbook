import { SessionCardDTO, SessionDetailDTO } from "../dto";

export interface SessionReadPort {
  findByCode(code: string): Promise<SessionDetailDTO | null>;
  listByUserId(userId: string): Promise<SessionCardDTO[]>;
  findDetailById(id: string): Promise<SessionDetailDTO | null>;
  findCardById(id: string): Promise<SessionCardDTO | null>;
}

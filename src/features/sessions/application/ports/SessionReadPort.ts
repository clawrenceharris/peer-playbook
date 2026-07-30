import { SessionDetailDTO, SessionListItemDTO } from "../dto";

export interface SessionReadPort {
  findByCode(code: string): Promise<SessionDetailDTO | null>;
  listByUserId(userId: string): Promise<SessionListItemDTO[]>;
  findDetailById(id: string): Promise<SessionDetailDTO | null>;
}

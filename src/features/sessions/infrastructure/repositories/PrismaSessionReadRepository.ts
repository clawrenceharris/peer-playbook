import { PrismaClient } from "@/generated/prisma/client";
import { SessionReadPort } from "../../application/ports";
import { SessionDetailDTO, SessionListItemDTO } from "../../application/dto";
import { SessionMapper } from "../mappers/SessionMapper";
import {
  sessionDetailSelection,
  sessionListItemSelection,
} from "../selection/session.selections";

export class PrismaSessionReadRepository implements SessionReadPort {
  constructor(private readonly prisma: PrismaClient) {}
  async listByUserId(userId: string): Promise<SessionListItemDTO[]> {
    const sessions = await this.prisma.public_sessions.findMany({
      where: {
        instructor_id: userId,
      },

      ...sessionListItemSelection,
    });
    return sessions.map((session) => SessionMapper.toListItem(session));
  }
  async findDetailById(id: string): Promise<SessionDetailDTO | null> {
    const record = await this.prisma.public_sessions.findUnique({
      where: {
        id,
      },
      ...sessionDetailSelection,
    });
    return record ? SessionMapper.toDetail(record) : null;
  }
  async findByCode(code: string): Promise<SessionDetailDTO | null> {
    const record = await this.prisma.public_sessions.findUnique({
      where: {
        session_code: code,
      },
      ...sessionDetailSelection,
    });
    return record ? SessionMapper.toDetail(record) : null;
  }
}

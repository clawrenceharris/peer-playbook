import { PrismaClient } from "@/generated/prisma/client";
import { SessionReadPort } from "../../application/ports";
import { SessionCardDTO, SessionDetailDTO } from "../../application/dto";
import { SessionMapper } from "../mappers/SessionMapper";
import {
  sessionCardSelection,
  sessionDetailSelection,
} from "../selection/session.selections";

export class PrismaSessionReadRepository implements SessionReadPort {
  constructor(private readonly prisma: PrismaClient) {}
  async listByUserId(userId: string): Promise<SessionCardDTO[]> {
    const sessions = await this.prisma.public_sessions.findMany({
      where: {
        instructor_id: userId,
      },

      ...sessionCardSelection,
    });
    return sessions.map((session) => SessionMapper.toCard(session));
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
  async findCardById(id: string): Promise<SessionCardDTO | null> {
    const record = await this.prisma.public_sessions.findUnique({
      where: {
        id,
      },
      ...sessionCardSelection,
    });
    return record ? SessionMapper.toCard(record) : null;
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

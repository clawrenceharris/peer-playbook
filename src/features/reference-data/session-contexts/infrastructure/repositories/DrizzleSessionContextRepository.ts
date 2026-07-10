import { SessionContextRepository } from "../../domain/repositories/SessionContextRepository";
import { SessionContextDTO } from "../../application/dto/SessionContextDTO";
import { prisma, type PrismaClient } from "@/db/client";

export class DrizzleSessionContextRepository implements SessionContextRepository {
  constructor(private readonly client: PrismaClient = prisma) {}
  async findByKey(key: string): Promise<SessionContextDTO> {
    const record = await this.client.session_contexts.findFirst({
      where: { key },
      select: { id: true, context: true, key: true },
    });
    if (!record) {
      throw new Error(`Missing session context: ${key}`);
    }
    return record;
  }

  async findAll(): Promise<SessionContextDTO[]> {
    const records = await this.client.session_contexts.findMany({
      select: { id: true, context: true, key: true },
      orderBy: { key: "asc" },
    });
    return records;
  }
}

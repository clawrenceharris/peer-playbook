import { SessionContextRepository } from "../../domain/repositories/SessionContextRepository";
import { SessionContextDTO } from "../../application/dto/SessionContextDTO";
import { type PrismaClient } from "@/lib/db/client";

export class PrismaSessionContextRepository implements SessionContextRepository {
  constructor(private readonly client: PrismaClient = client) {}
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

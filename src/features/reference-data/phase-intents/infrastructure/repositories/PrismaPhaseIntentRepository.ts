import { PhaseIntent } from "../../domain/types/PhaseIntent";
import { PhaseIntentRepository } from "../../domain/repositories/PhaseIntentRepository";
import { PhaseIntentMapper } from "../mappers/PhaseIntentMapper";
import { client, type PrismaClient } from "@/lib/db/client";

export class PrismaPhaseIntentRepository implements PhaseIntentRepository {
  constructor(private readonly client: PrismaClient = client) {}
  async findById(id: string): Promise<PhaseIntent> {
    const record = await this.client.phase_intents.findUnique({
      where: { id },
      select: { id: true, key: true },
    });
    if (!record) {
      throw new Error(`Missing phase intent: ${id}`);
    }
    return PhaseIntentMapper.toDomain(record);
  }

  async findAll(): Promise<PhaseIntent[]> {
    const records = await this.client.phase_intents.findMany({
      orderBy: { sort_order: "asc" },
      select: { id: true, key: true },
    });
    return records.map(PhaseIntentMapper.toDomain);
  }
}

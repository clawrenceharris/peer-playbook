import { type PrismaClient } from "@/lib/db/client";
import {
  PlaybookCardDTO,
  PlaybookDetailDTO,
  PlaybookPagePhaseDTO,
  PlaybookStrategyCardDTO,
  PlaybookStrategyDetailDTO,
  SessionContextDTO,
} from "../../application/dto";
import { PlaybookReadRepository } from "../../domain/repositories";
import {
  PlaybookMapper,
  PlaybookPhaseMapper,
  PlaybookStrategyMapper,
} from "../mappers";
import {
  playbookCardArgs,
  playbookDetailArgs,
  playbookPhaseArgs,
} from "../selection/playbook.selections";
import {
  playbookStrategyCardArgs,
  playbookStrategyDetailArgs,
} from "../selection/playbook-strategy.seletions";

export class PrismaPlaybookReadRepository implements PlaybookReadRepository {
  constructor(private readonly client: PrismaClient = client) {}
  async listPlaybookContexts(): Promise<SessionContextDTO[]> {
    const records = await this.client.session_contexts.findMany({
      select: { id: true, context: true, key: true },

      orderBy: { key: "asc" },
    });
    return records;
  }
  async findPlaybookPhasesById(
    playbookId: string,
  ): Promise<PlaybookPagePhaseDTO[]> {
    const records = await this.client.playbook_phases.findMany({
      where: { playbook_id: playbookId },

      orderBy: { position: "asc" },
      ...playbookPhaseArgs,
    });

    return records.map(PlaybookPhaseMapper.toDetail);
  }
  async findPlaybookDetailById(id: string): Promise<PlaybookDetailDTO | null> {
    const record = await this.client.playbooks.findUnique({
      where: { id },
      ...playbookDetailArgs,
    });
    return record ? PlaybookMapper.toDetail(record) : null;
  }
  async listPlaybooks(): Promise<PlaybookCardDTO[]> {
    const records = await this.client.playbooks.findMany({
      ...playbookCardArgs,
    });
    return records.map(PlaybookMapper.toCard);
  }
  async listPlaybooksByUserId(userId: string): Promise<PlaybookCardDTO[]> {
    const records = await this.client.playbooks.findMany({
      where: { created_by: userId },

      ...playbookCardArgs,
    });
    return records.map(PlaybookMapper.toCard);
  }

  async listSavedPlaybookIdsByUserId(userId: string): Promise<string[]> {
    const records = await this.client.saved_playbooks.findMany({
      where: { user_id: userId },
      select: { playbook_id: true },

      orderBy: { created_at: "desc" },
    });

    return records.map((record) => record.playbook_id);
  }

  async findPlaybookStrategyDetailsById(
    playbookId: string,
  ): Promise<PlaybookStrategyDetailDTO[]> {
    const records = await this.client.playbook_strategies.findMany({
      where: { playbook_id: playbookId },

      orderBy: { position: "asc" },
      ...playbookStrategyDetailArgs,
    });
    return records.map(PlaybookStrategyMapper.toDetail);
  }

  async findPlaybookStrategyCardsById(
    playbookId: string,
  ): Promise<PlaybookStrategyCardDTO[]> {
    const records = await this.client.playbook_strategies.findMany({
      where: { playbook_id: playbookId },
      orderBy: { position: "asc" },
      ...playbookStrategyCardArgs,
    });
    return records.map(PlaybookStrategyMapper.toCard);
  }

  async listAllStrategies(): Promise<PlaybookStrategyDetailDTO[]> {
    const records = await this.client.playbook_strategies.findMany({
      ...playbookStrategyDetailArgs,
    });
    return records.map(PlaybookStrategyMapper.toDetail);
  }
}

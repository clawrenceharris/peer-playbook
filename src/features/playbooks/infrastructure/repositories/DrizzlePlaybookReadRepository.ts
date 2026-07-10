import { prisma, type PrismaClient } from "@/db/client";
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
import type { PlaybookRecord } from "../mappers/playbook.mappers";

export class DrizzlePlaybookReadRepository implements PlaybookReadRepository {
  constructor(private readonly client: PrismaClient = prisma) {}
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
      select: {
        id: true,
        title: true,
        description: true,
        objective: true,
        estimated_minutes: true,
        position: true,
        phase_intents: {
          select: {
            id: true,
            key: true,
            label: true,
            description: true,
            color_token: true,
            icon_name: true,
            sort_order: true,
          },
        },
      },
    });

    return records.map(PlaybookPhaseMapper.toPagePhase);
  }
  async findPlaybookDetailById(id: string): Promise<PlaybookDetailDTO | null> {
    const record = await this.client.playbooks.findUnique({
      where: { id },
      select: {
        id: true,
        topic: true,
        course_name: true,
        subject: true,
        createdBy: true,
        created_at: true,
        updated_at: true,
        published: true,
      },
    });
    return record ? PlaybookMapper.toDetail(record as PlaybookRecord) : null;
  }
  async listPlaybooks(): Promise<PlaybookCardDTO[]> {
    const records = await this.client.playbooks.findMany({
      take: 10,
      select: {
        id: true,
        topic: true,
        course_name: true,
        subject: true,
        createdBy: true,
        created_at: true,
        updated_at: true,
        published: true,
      },
    });
    return records.map(PlaybookMapper.toCard);
  }
  async listPlaybooksByUserId(userId: string): Promise<PlaybookCardDTO[]> {
    const records = await this.client.playbooks.findMany({
      where: { createdBy: userId },
      take: 10,
      select: {
        id: true,
        topic: true,
        course_name: true,
        subject: true,
        createdBy: true,
        created_at: true,
        updated_at: true,
        published: true,
      },
    });
    return records.map(PlaybookMapper.toCard);
  }
  async findPlaybookStrategyDetailsById(
    playbookId: string,
  ): Promise<PlaybookStrategyDetailDTO[]> {
    const records = await this.client.playbook_strategies.findMany({
      where: { playbook_id: playbookId },
      orderBy: { position: "asc" },
      select: {
        id: true,
        title: true,
        phase: true,
        playbook_phase_id: true,
        steps: true,
        created_at: true,
        updated_at: true,
      },
    });
    return records.map(PlaybookStrategyMapper.toDetail);
  }

  async findPlaybookStrategyCardsById(
    playbookId: string,
  ): Promise<PlaybookStrategyCardDTO[]> {
    const records = await this.client.playbook_strategies.findMany({
      where: { playbook_id: playbookId },
      orderBy: { position: "asc" },
      select: {
        id: true,
        title: true,
        phase: true,
        playbook_phase_id: true,
        steps: true,
        created_at: true,
        updated_at: true,
      },
    });
    return records.map(PlaybookStrategyMapper.toCard);
  }

  async listAllStrategies(): Promise<PlaybookStrategyDetailDTO[]> {
    const records = await this.client.playbook_strategies.findMany({
      select: {
        id: true,
        title: true,
        phase: true,
        playbook_phase_id: true,
        steps: true,
        created_at: true,
        updated_at: true,
      },
    });
    return records.map(PlaybookStrategyMapper.toDetail);
  }
}

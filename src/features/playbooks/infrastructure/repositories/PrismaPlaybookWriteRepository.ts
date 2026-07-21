import { PlaybookWriteRepository } from "../../domain/repositories/PlaybookWriteRepository";
import { client, type PrismaClient } from "@/lib/db/client";
import {
  PlaybookCardDTO,
  PlaybookDetailDTO,
  PlaybookPhaseDTO,
  PlaybookStrategyCardDTO,
} from "../../application/dto";
import {
  CreatePlaybookPhaseCommand,
  CreatePlaybookCommand,
  GeneratePlaybookCommand,
  CreatePlaybookStrategyCommand,
  UpdatePlaybookPhasesCommand,
  UpdatePlaybookCommand,
  RemovePlaybookStrategyCommand,
} from "../../domain/types";
import { UpdatePlaybookStrategyCommand } from "../../domain/types/playbook-strategy.types";
import {
  PlaybookMapper,
  PlaybookPhaseMapper,
  PlaybookStrategyMapper,
} from "../mappers";
import { CreatePlaybookResult } from "../../application/dto";
import type { lesson_phase } from "@/lib/db/client";
import {
  playbookCardArgs,
  playbookDetailArgs,
  playbookPhaseArgs,
} from "../selection/playbook.selections";
import { playbookStrategyCardArgs } from "../selection/playbook-strategy.seletions";

type PrismaTransactionClient = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0];

export class PrismaPlaybookWriteRepository implements PlaybookWriteRepository {
  constructor(private readonly client: PrismaClient = client) {}
  async generatePlaybook(
    data: GeneratePlaybookCommand,
  ): Promise<CreatePlaybookResult> {
    const record = await this.client.playbooks.create({
      data: {
        topic: data.topic,
        course_name: data.courseName,
        subject: data.subject,
        created_by: data.createdBy,
        title: data.title,
      },
      select: { id: true, topic: true },
    });
    return {
      id: record.id,
      topic: record.topic,
    };
  }
  async listPlaybooks(): Promise<PlaybookCardDTO[]> {
    const records = await this.client.playbooks.findMany({
      take: 10,
      ...playbookCardArgs,
    });
    return records.map(PlaybookMapper.toCard);
  }
  async createPlaybook(
    data: CreatePlaybookCommand,
  ): Promise<CreatePlaybookResult> {
    return this.client.$transaction(async (tx) => {
      const playbook = await tx.playbooks.create({
        data: {
          topic: data.topic,
          course_name: data.courseName,
          subject: data.subject,
          created_by: data.createdBy,
          title: data.title,
        },
        select: { id: true, topic: true },
      });

      const phases = data.phases ?? [];
      if (phases.length === 0) {
        return {
          id: playbook.id,
          topic: playbook.topic,
        };
      }

      const intentKeys = Array.from(
        new Set(phases.map((phase) => phase.intentKey)),
      );
      const intentRecords = await tx.phase_intents.findMany({
        where: { key: { in: intentKeys } },
        select: { id: true, key: true },
      });
      const intentIdByKey = new Map<string, string>(
        intentRecords.map((intent) => [intent.key, intent.id]),
      );

      const phaseRows = phases.map((phase) => {
        const phaseIntentId = intentIdByKey.get(phase.intentKey);
        if (!phaseIntentId) {
          throw new Error(`Missing phase intent: ${phase.intentKey}`);
        }

        return {
          playbook_id: playbook.id,
          phase_intent_id: phaseIntentId,
          title: phase.title,
          description: null,
          objective: null,
          estimated_minutes: null,
          position: phase.position,
        };
      });

      await tx.playbook_phases.createMany({
        data: phaseRows,
      });
      const createdPhaseRecords = await tx.playbook_phases.findMany({
        where: { playbook_id: playbook.id },
        select: { id: true, position: true },
      });
      const phaseIdByPosition = new Map<number, string>(
        createdPhaseRecords.map((phase) => [phase.position, phase.id]),
      );

      await this.createPlaybookStrategies(
        tx,
        playbook.id,
        phases,
        phaseIdByPosition,
      );

      return {
        id: playbook.id,
        topic: playbook.topic,
      };
    });
  }

  async updatePlaybookPhases(data: UpdatePlaybookPhasesCommand): Promise<void> {
    await this.client.$transaction(async (tx) => {
      const intentKeys = Array.from(
        new Set(data.phases.map((phase) => phase.intentKey)),
      );
      const intentRecords =
        intentKeys.length > 0
          ? await tx.phase_intents.findMany({
              where: { key: { in: intentKeys } },
              select: { id: true, key: true },
            })
          : [];
      const intentIdByKey = new Map<string, string>(
        intentRecords.map((intent) => [intent.key, intent.id]),
      );

      for (const phase of data.phases) {
        const phaseIntentId = intentIdByKey.get(phase.intentKey);
        if (!phaseIntentId) {
          throw new Error(`Missing phase intent: ${phase.intentKey}`);
        }

        await tx.playbook_phases.updateMany({
          where: {
            id: phase.id,
            playbook_id: data.playbookId,
          },
          data: {
            title: phase.title,
            phase_intent_id: phaseIntentId,
            position: phase.position,
            estimated_minutes: phase.estimatedMinutes,
            updated_at: new Date(),
          },
        });
      }
    });
  }

  async createPlaybookStrategy(
    data: CreatePlaybookStrategyCommand,
  ): Promise<PlaybookStrategyCardDTO> {
    const record = await this.client.playbook_strategies.create({
      data: {
        playbook_id: data.playbookId,
        playbook_phase_id: data.playbookPhaseId,
        slug: data.slug,
        title: data.title,
        category: data.category,
        steps: data.steps,
        phase: data.phase as lesson_phase,
        position: data.position,
        description: data.description,
        facilitator_notes: data.facilitatorNotes,
        estimated_minutes: data.estimatedMinutes,
        source_id: data.sourceId,
        source_type: data.sourceType,
      },
      ...playbookStrategyCardArgs,
    });
    return PlaybookStrategyMapper.toCard(record);
  }

  async createPlaybookPhase(
    playbookId: string,
    data: CreatePlaybookPhaseCommand,
  ): Promise<PlaybookPhaseDTO> {
    // phase_intent_id is a UUID FK — resolve from the stable intent key first.
    const intentRecord = await this.client.phase_intents.findUnique({
      where: { key: data.intentKey },
      select: { id: true },
    });
    if (!intentRecord) {
      throw new Error(`Missing phase intent: ${data.intentKey}`);
    }

    const record = await this.client.playbook_phases.create({
      data: {
        playbook_id: playbookId,
        title: data.title,
        phase_intent_id: intentRecord.id,
        position: data.position,
        estimated_minutes: null,
        description: null,
        objective: null,
      },
      ...playbookPhaseArgs,
    });
    return PlaybookPhaseMapper.toDetail(record);
  }

  private async createPlaybookStrategies(
    tx: PrismaTransactionClient,
    playbookId: string,
    phases: CreatePlaybookPhaseCommand[],
    phaseIdByPosition: Map<number, string>,
  ): Promise<void> {
    const refs = phases.flatMap((phase) =>
      phase.strategies.map((strategy, position) => ({
        ...strategy,
        phasePosition: phase.position,
        legacyPhase: phase.legacyPhase,
        position,
      })),
    );

    if (refs.length === 0) return;

    const userStrategy = refs.find((ref) => ref.sourceType === "user");
    if (userStrategy) {
      throw new Error(
        "User-created strategies are not available in the Prisma schema yet.",
      );
    }

    const strategyIds = Array.from(new Set(refs.map((ref) => ref.sourceId)));
    const strategyRecords = await tx.strategies.findMany({
      where: { id: { in: strategyIds } },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        steps: true,
        description: true,
      },
    });
    const strategyById = new Map(
      strategyRecords.map((strategy) => [strategy.id, strategy]),
    );

    const rows = refs.map((ref) => {
      const strategy = strategyById.get(ref.sourceId);
      const playbookPhaseId = phaseIdByPosition.get(ref.phasePosition);
      if (!strategy) {
        throw new Error(`Missing strategy: ${ref.sourceId}`);
      }
      if (!playbookPhaseId) {
        throw new Error(
          `Missing playbook phase at position ${ref.phasePosition}`,
        );
      }

      return {
        playbook_id: playbookId,
        playbook_phase_id: playbookPhaseId,
        slug: strategy.slug,
        title: strategy.title,
        category: strategy.category || "strategy",
        steps: strategy.steps,
        phase: ref.legacyPhase as lesson_phase,
        position: ref.position,
        description: strategy.description,
        facilitator_notes: null,
        estimated_minutes: null,
        source_id: strategy.id,
        source_type: ref.sourceType,
      };
    });

    await tx.playbook_strategies.createMany({
      data: rows,
    });
  }
  async updatePlaybook(
    id: string,
    data: UpdatePlaybookCommand,
  ): Promise<PlaybookCardDTO> {
    const record = await this.client.playbooks.update({
      where: { id },
      data: {
        ...(data.topic !== undefined && { topic: data.topic }),
        ...(data.courseName !== undefined && {
          course_name: data.courseName,
        }),
        ...(data.subject !== undefined && { subject: data.subject }),
        ...(data.title !== undefined && { title: data.title }),
        updated_at: new Date(),
      },
      ...playbookCardArgs,
    });
    return PlaybookMapper.toCard(record);
  }
  async deletePlaybook(id: string): Promise<void> {
    return this.client.playbooks.delete({ where: { id } }).then(() => {});
  }
  async addFavoritePlaybook(playbookId: string, userId: string): Promise<void> {
    const record = await this.client.saved_playbooks.findFirst({
      where: {
        playbook_id: playbookId,
        user_id: userId,
      },
      select: { id: true },
    });
    if (!record) {
      await this.client.saved_playbooks.create({
        data: {
          playbook_id: playbookId,
          user_id: userId,
        },
      });
    }
  }
  async removeFavoritePlaybook(
    playbookId: string,
    userId: string,
  ): Promise<void> {
    await this.client.saved_playbooks.deleteMany({
      where: {
        playbook_id: playbookId,
        user_id: userId,
      },
    });
  }
  async updatePlaybookStrategy(
    strategyId: string,
    data: UpdatePlaybookStrategyCommand,
  ): Promise<PlaybookStrategyCardDTO> {
    const record = await this.client.playbook_strategies.update({
      where: { id: strategyId },
      data: {
        ...(data.steps !== undefined && { steps: data.steps }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.phase !== undefined && {
          phase: data.phase as lesson_phase,
        }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.facilitatorNotes !== undefined && {
          facilitator_notes: data.facilitatorNotes,
        }),
        ...(data.estimatedMinutes !== undefined && {
          estimated_minutes: data.estimatedMinutes,
        }),
        ...(data.sourceId !== undefined && { source_id: data.sourceId }),
        ...(data.sourceType !== undefined && {
          source_type: data.sourceType,
        }),
        updated_at: new Date(),
      },
      ...playbookStrategyCardArgs,
    });
    return PlaybookStrategyMapper.toCard(record);
  }

  async removePlaybookStrategy(
    data: RemovePlaybookStrategyCommand,
  ): Promise<void> {
    await this.client.playbook_strategies.deleteMany({
      where: {
        id: data.strategyId,
        playbook_id: data.playbookId,
      },
    });
  }

  async getPlaybookDetailById(id: string): Promise<PlaybookDetailDTO | null> {
    const record = await this.client.playbooks.findUnique({
      where: { id },
      ...playbookDetailArgs,
    });
    return record ? PlaybookMapper.toDetail(record) : null;
  }
}

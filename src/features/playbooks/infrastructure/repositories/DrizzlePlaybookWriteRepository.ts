import { PlaybookWriteRepository } from "../../domain/repositories/PlaybookWriteRepository";
import { prisma, type PrismaClient } from "@/db/client";
import {
  PlaybookCardDTO,
  PlaybookDetailDTO,
  PlaybookStrategyCardDTO,
} from "../../application/dto";
import {
  CreatePlaybookPhaseCommand,
  CreatePlaybookCommand,
  GeneratePlaybookCommand,
  UpdatePlaybookPhasesCommand,
  UpdatePlaybookCommand,
} from "../../domain/types";
import { UpdatePlaybookStrategyCommand } from "../../domain/types/playbook-strategy.types";
import { PlaybookMapper, PlaybookStrategyMapper } from "../mappers";
import { CreatePlaybookResult } from "../../application/dto";
import type { PlaybookRecord } from "../mappers/playbook.mappers";
import type { lesson_phase } from "@/db/client";

type PrismaTransactionClient = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0];

export class DrizzlePlaybookWriteRepository implements PlaybookWriteRepository {
  constructor(private readonly client: PrismaClient = prisma) {}
  async generatePlaybook(
    data: GeneratePlaybookCommand,
  ): Promise<CreatePlaybookResult> {
    const record = await this.client.playbooks.create({
      data: {
        topic: data.topic,
        course_name: data.courseName,
        subject: data.subject,
        createdBy: data.createdBy,
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
  async createPlaybook(
    data: CreatePlaybookCommand,
  ): Promise<CreatePlaybookResult> {
    return this.client.$transaction(async (tx) => {
      const playbook = await tx.playbooks.create({
        data: {
          topic: data.topic,
          course_name: data.courseName,
          subject: data.subject,
          createdBy: data.createdBy,
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
            updated_at: new Date(),
          },
        });
      }
    });
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
        "User-created strategies are not available in the Drizzle schema yet.",
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
        card_slug: strategy.slug,
        title: strategy.title,
        category: strategy.category || "strategy",
        steps: strategy.steps,
        phase: ref.legacyPhase as lesson_phase,
        position: ref.position,
        description: strategy.description,
        source_id: strategy.id,
        source_type: ref.sourceType,
      };
    });

    await tx.playbook_strategies.createMany({
      data: rows,
    });
  }
  updatePlaybook(
    id: string,
    data: UpdatePlaybookCommand,
  ): Promise<PlaybookCardDTO> {
    return this.client.playbooks
      .update({
        where: { id },
        data: {
          ...(data.topic !== undefined && { topic: data.topic }),
          ...(data.courseName !== undefined && { course_name: data.courseName }),
          ...(data.subject !== undefined && { subject: data.subject }),
          updated_at: new Date(),
        },
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
      })
      .then((record) => PlaybookMapper.toCard(record as PlaybookRecord));
  }
  deletePlaybook(id: string): Promise<void> {
    return this.client.playbooks.delete({ where: { id } }).then(() => {});
  }
  addFavoritePlaybook(playbookId: string, userId: string): Promise<void> {
    return this.client.saved_playbooks
      .findFirst({
        where: {
          playbook_id: playbookId,
          user_id: userId,
        },
        select: { id: true },
      })
      .then(async (record) => {
        if (!record) {
          await this.client.saved_playbooks.create({
            data: {
              playbook_id: playbookId,
              user_id: userId,
            },
          });
        }
      });
  }
  removeFavoritePlaybook(playbookId: string, userId: string): Promise<void> {
    return this.client.saved_playbooks
      .deleteMany({
        where: {
          playbook_id: playbookId,
          user_id: userId,
        },
      })
      .then(() => {});
  }
  updatePlaybookStrategy(
    strategyId: string,
    data: UpdatePlaybookStrategyCommand,
  ): Promise<PlaybookStrategyCardDTO> {
    return this.client.playbook_strategies
      .update({
        where: { id: strategyId },
        data: {
          ...(data.steps !== undefined && { steps: data.steps }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.phase !== undefined && {
            phase: data.phase as lesson_phase,
          }),
          updated_at: new Date(),
        },
        select: {
          id: true,
          title: true,
          phase: true,
          playbook_phase_id: true,
          steps: true,
          created_at: true,
          updated_at: true,
        },
      })
      .then((record) => PlaybookStrategyMapper.toCard(record));
  }

  async getPlaybookDetailById(id: string): Promise<PlaybookDetailDTO | null> {
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
}

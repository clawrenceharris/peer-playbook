import { ApplicationError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import { CreatePlaybookResult } from "../dto";
import { GeneratePlaybookInput } from "../dto/GeneratePlaybookDTO";
import { fail, ok, Result } from "@/shared/application";
import { PlaybookGenerationPlanner } from "@/features/ai";
import { CreatePlaybookPhaseCommand } from "../../domain/types";

export class GeneratePlaybookUseCase {
  constructor(
    private readonly playbookRepository: PlaybookWriteRepository,
    private readonly playbookGenerationPlanner: PlaybookGenerationPlanner,
  ) {}

  async execute(
    input: GeneratePlaybookInput,
  ): Promise<Result<CreatePlaybookResult>> {
    try {
      const { topic, courseName, subject, contexts, instructions, modes } =
        input;
      const { plan, catalog } = await this.playbookGenerationPlanner.plan({
        title: input.title,
        topic,
        courseName,
        subject: subject ?? "",
        contexts,
        instructions: instructions ?? "",
        modes: modes ?? [],
      });
      const catalogBySlug = new Map(
        catalog.map((strategy) => [strategy.slug, strategy]),
      );
      const phases = buildGeneratedPhases(plan.strategies, catalogBySlug);

      const result = await this.playbookRepository.createPlaybook({
        title: input.title,
        topic,
        courseName: courseName ?? null,
        subject: subject ?? "",
        createdBy: input.userId,
        contexts,
        methodology: null, // TODO: Implement methodology generation
        modes: modes ?? [],
        phases,
      });
      return ok(result);
    } catch (error) {
      if (error instanceof ApplicationError) {
        return fail(error);
      }

      const appError = ApplicationError.unexpected(
        error,
        "Failed to generate playbook",
      );
      return fail(appError);
    }
  }
}

function buildGeneratedPhases(
  strategies: {
    slug: string;
    phase: "warmup" | "workout" | "closer";
  }[],
  catalogBySlug: Map<string, { id: string }>,
): CreatePlaybookPhaseCommand[] {
  const strategyByPhase = new Map(
    strategies.map((strategy) => [strategy.phase, strategy]),
  );

  return [
    {
      title: "Warmup",
      intentKey: "activate",
      legacyPhase: "warmup",
      position: 0,
      strategies: [strategyByPhase.get("warmup")].flatMap((strategy) => {
        const catalogItem = strategy ? catalogBySlug.get(strategy.slug) : null;
        return catalogItem
          ? [{ sourceType: "system" as const, sourceId: catalogItem.id }]
          : [];
      }),
    },
    {
      title: "Workout",
      intentKey: "apply",
      legacyPhase: "workout",
      position: 1,
      strategies: [strategyByPhase.get("workout")].flatMap((strategy) => {
        const catalogItem = strategy ? catalogBySlug.get(strategy.slug) : null;
        return catalogItem
          ? [{ sourceType: "system" as const, sourceId: catalogItem.id }]
          : [];
      }),
    },
    {
      title: "Closer",
      intentKey: "reflect",
      legacyPhase: "closer",
      position: 2,
      strategies: [strategyByPhase.get("closer")].flatMap((strategy) => {
        const catalogItem = strategy ? catalogBySlug.get(strategy.slug) : null;
        return catalogItem
          ? [{ sourceType: "system" as const, sourceId: catalogItem.id }]
          : [];
      }),
    },
  ];
}

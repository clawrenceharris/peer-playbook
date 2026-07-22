import { z } from "zod";
import { ApplicationError } from "@/shared/utils";
import {
  AiInstructionalContext,
  AiStrategyCatalogItem,
  GeneratedPlaybookPlan,
  JsonCompletionPort,
  PlaybookGenerationRequest,
  StrategyCatalogRepository,
} from "../../domain";
import { PlaybookGenerationPromptBuilder } from "../prompts/PlaybookGenerationPromptBuilder";
import { playbookGenerationContext } from "../context/playbookGenerationContext";

const generatedPlanSchema = z.object({
  strategies: z
    .array(
      z.object({
        slug: z.string().min(1),
        phase: z.enum(["warmup", "workout", "closer"]),
        rationale: z.string().optional(),
      }),
    )
    .length(3),
});

const requiredPhases = ["warmup", "workout", "closer"] as const;

/**
 * Coordinates the AI planning boundary: load candidate strategies, build the
 * prompt, demand JSON, validate the response, and reject plans that do not
 * satisfy the app's structural rules before anything is persisted.
 */
export class PlaybookGenerationPlanner {
  constructor(
    private readonly catalogRepository: StrategyCatalogRepository,
    private readonly jsonCompletion: JsonCompletionPort,
    private readonly promptBuilder = new PlaybookGenerationPromptBuilder(),
    private readonly instructionalContext: AiInstructionalContext[] =
      playbookGenerationContext,
  ) {}

  async plan(request: PlaybookGenerationRequest): Promise<{
    plan: GeneratedPlaybookPlan;
    catalog: AiStrategyCatalogItem[];
  }> {
    // The generator still targets the legacy three-phase model, so it must have
    // enough candidates to choose exactly one warmup, workout, and closer.
    const catalog = await this.catalogRepository.listForPlaybookGeneration(
      request.contexts,
    );

    if (catalog.length < 3) {
      throw ApplicationError.validation(
        "Playbooks need at least 3 matching strategies. Try removing a context filter or adding more strategy coverage.",
      );
    }

    const prompt = this.promptBuilder.build({
      request,
      catalog,
      instructionalContext: this.instructionalContext,
    });
    let rawPlan: unknown;
    try {
      rawPlan = await this.jsonCompletion.completeJson(prompt);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw ApplicationError.validation(
          "The AI returned malformed JSON. Please try generating again.",
        );
      }
      throw ApplicationError.unexpected(
        error,
        "The AI generation service failed. Please try again soon.",
      );
    }
    const parsed = generatedPlanSchema.safeParse(rawPlan);

    if (!parsed.success) {
      throw ApplicationError.validation(
        "The AI response did not match the expected playbook plan format.",
      );
    }

    this.validatePlan(parsed.data, catalog);

    return { plan: parsed.data, catalog };
  }

  private validatePlan(
    plan: GeneratedPlaybookPlan,
    catalog: AiStrategyCatalogItem[],
  ) {
    const catalogSlugs = new Set(catalog.map((strategy) => strategy.slug));
    const selectedSlugs = plan.strategies.map((strategy) => strategy.slug);
    const duplicateSlug = selectedSlugs.find(
      (slug, index) => selectedSlugs.indexOf(slug) !== index,
    );

    if (duplicateSlug) {
      throw ApplicationError.validation(
        `The AI selected the same strategy more than once: ${duplicateSlug}`,
      );
    }

    const unknownSlug = selectedSlugs.find((slug) => !catalogSlugs.has(slug));
    if (unknownSlug) {
      throw ApplicationError.validation(
        `The AI selected an unknown strategy: ${unknownSlug}`,
      );
    }

    for (const phase of requiredPhases) {
      const count = plan.strategies.filter(
        (strategy) => strategy.phase === phase,
      ).length;
      if (count !== 1) {
        throw ApplicationError.validation(
          `The AI must select exactly one ${phase} strategy.`,
        );
      }
    }
  }
}

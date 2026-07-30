"use server";

import { makeUpdatePlaybookStrategyUseCase } from "@/composition/playbook";
import {
  PlaybookStrategyCardDTO,
} from "@/features/playbooks/application/dto";
import { updatePlaybookStrategySchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";
import {
  assertStrategyOwnership,
  requireCurrentUserId,
} from "../utils/ownership";

const updatePlaybookStrategyActionSchema = updatePlaybookStrategySchema.extend({
  strategyId: z.string().uuid(),
  playbookId: z.string().uuid().optional(),
});

export async function updatePlaybookStrategyAction(
  input: {
    strategyId: string;
    playbookId?: string;
  } & z.input<typeof updatePlaybookStrategySchema>,
): Promise<ActionResult<PlaybookStrategyCardDTO>> {
  try {
    const parsed = updatePlaybookStrategyActionSchema.safeParse(input);
    if (!parsed.success) {
      return fail(
        toActionError(ApplicationError.validation(parsed.error.message)),
      );
    }
    const userId = await requireCurrentUserId();
    await assertStrategyOwnership(input.strategyId, userId);

    const useCase = makeUpdatePlaybookStrategyUseCase();
    const result = await useCase.execute({
      strategyId: input.strategyId,
      playbookId: input.playbookId,
      steps: parsed.data.steps,
      title: parsed.data.title,
      slug: parsed.data.slug,
      category: parsed.data.category,
      phase: parsed.data.phase,
      position: parsed.data.position,
      description: parsed.data.description,
      sourceId: parsed.data.sourceId,
      sourceType: parsed.data.sourceType,
      facilitatorNotes: parsed.data.facilitatorNotes,
      estimatedMinutes: parsed.data.estimatedMinutes,
    });
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(toActionError(error));
    }
    return fail(
      toActionError(
        ApplicationError.unexpected(
          error,
          "Failed to update playbook strategy",
        ),
      ),
    );
  }
}

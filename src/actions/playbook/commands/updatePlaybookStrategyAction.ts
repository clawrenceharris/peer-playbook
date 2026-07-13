"use server";

import { makeUpdatePlaybookStrategyUseCase } from "@/composition/playbook";
import {
  PlaybookStrategyCardDTO,
  UpdatePlaybookStrategyInput,
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
  input: UpdatePlaybookStrategyInput,
): Promise<ActionResult<PlaybookStrategyCardDTO>> {
  try {
    const { error } = updatePlaybookStrategyActionSchema.safeParse(input);
    if (error) {
      return fail(toActionError(ApplicationError.validation(error.message)));
    }
    const userId = await requireCurrentUserId();
    await assertStrategyOwnership(input.strategyId, userId);

    const useCase = makeUpdatePlaybookStrategyUseCase();
    const result = await useCase.execute(input);
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

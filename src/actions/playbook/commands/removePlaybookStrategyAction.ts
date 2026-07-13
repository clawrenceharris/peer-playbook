"use server";

import { makeRemovePlaybookStrategyUseCase } from "@/composition/playbook";
import {
  RemovePlaybookStrategyInput,
} from "@/features/playbooks/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";
import {
  assertStrategyOwnership,
  requireCurrentUserId,
} from "../utils/ownership";

const removePlaybookStrategyActionSchema = z.object({
  playbookId: z.string().uuid(),
  strategyId: z.string().uuid(),
});

export async function removePlaybookStrategyAction(
  input: RemovePlaybookStrategyInput,
): Promise<ActionResult<void>> {
  try {
    const { error } = removePlaybookStrategyActionSchema.safeParse(input);
    if (error) {
      return fail(toActionError(ApplicationError.validation(error.message)));
    }

    const userId = await requireCurrentUserId();
    await assertStrategyOwnership(input.strategyId, userId);

    const useCase = makeRemovePlaybookStrategyUseCase();
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
          "Failed to remove playbook strategy",
        ),
      ),
    );
  }
}


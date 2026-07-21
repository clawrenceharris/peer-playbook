"use server";

import { makeUpdatePlaybookPhasesUseCase } from "@/composition/playbook";
import {
  UpdatePlaybookPhasesInput,
  UpdatePlaybookPhasesResult,
} from "@/features/playbooks/application/dto";
import { phaseIntentKeySchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";
import {
  assertPlaybookOwnership,
  requireCurrentUserId,
} from "../utils/ownership";

const updatePlaybookPhasesActionSchema = z.object({
  playbookId: z.string().uuid(),
  phases: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string().min(1),
      intentKey: phaseIntentKeySchema,
      position: z.number().int().nonnegative(),
      estimatedMinutes: z.number().int().nonnegative().nullable(),
    }),
  ),
});

export async function updatePlaybookPhasesAction(
  input: UpdatePlaybookPhasesInput,
): Promise<ActionResult<UpdatePlaybookPhasesResult>> {
  try {
    const { error } = updatePlaybookPhasesActionSchema.safeParse(input);
    if (error) {
      return fail(toActionError(ApplicationError.validation(error.message)));
    }
    const userId = await requireCurrentUserId();
    await assertPlaybookOwnership(input.playbookId, userId);

    const useCase = makeUpdatePlaybookPhasesUseCase();
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
        ApplicationError.unexpected(error, "Failed to update playbook phases"),
      ),
    );
  }
}

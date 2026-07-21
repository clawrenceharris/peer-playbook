"use server";

import { makeAddPlaybookStrategyUseCase } from "@/composition/playbook";
import {
  AddPlaybookStrategyInput,
  PlaybookStrategyCardDTO,
} from "@/features/playbooks/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";
import {
  assertPlaybookOwnership,
  requireCurrentUserId,
} from "../utils/ownership";

const addPlaybookStrategyActionSchema = z.object({
  playbookId: z.uuid(),
  playbookPhaseId: z.uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  steps: z.array(z.string()),
  description: z.string(),
  phase: z.enum(["warmup", "workout", "closer"]),
  position: z.number().int().nonnegative(),
  sourceId: z.uuid(),
  sourceType: z.enum(["system", "user"]),
  facilitatorNotes: z.string().nullable().optional(),
  estimatedMinutes: z.number().int().nonnegative().nullable().optional(),
});

export async function addPlaybookStrategyAction(
  input: AddPlaybookStrategyInput,
): Promise<ActionResult<PlaybookStrategyCardDTO>> {
  try {
    const { error } = addPlaybookStrategyActionSchema.safeParse(input);
    if (error) {
      return fail(toActionError(ApplicationError.validation(error.message)));
    }

    const userId = await requireCurrentUserId();
    await assertPlaybookOwnership(input.playbookId, userId);

    const useCase = makeAddPlaybookStrategyUseCase();
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
        ApplicationError.unexpected(error, "Failed to add playbook strategy"),
      ),
    );
  }
}

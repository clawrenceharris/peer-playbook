"use server";

import { AddPlaybookPhaseInput } from "@/features/playbooks/application/dto/AddPlaybookPhaseInput";
import { ActionResult } from "@/shared/action/ActionError";
import {
  assertPlaybookOwnership,
  requireCurrentUserId,
} from "../utils/ownership";
import { fail } from "@/shared/application";
import { toActionError } from "@/shared/action/toActionError";
import { ApplicationError } from "@/shared/utils";
import { makeAddPlaybookPhaseUseCase } from "@/composition/playbook";
import { z } from "zod";
import { PlaybookPhaseDTO } from "@/features/playbooks/application/dto";

const addPlaybookPhaseActionSchema = z.object({
  playbookId: z.uuid(),
  title: z.string().min(1),
  position: z.number().int().nonnegative(),
  estimatedMinutes: z.number().int().nonnegative().nullable(),
  description: z.string().nullable(),
  objective: z.string().nullable(),
  // Matches AddPlaybookPhaseInput.intent (PhaseIntent string values).
  intent: z.enum(["activate", "explore", "apply", "reflect"]),
});

export async function addPlaybookPhaseAction(
  input: AddPlaybookPhaseInput,
): Promise<ActionResult<PlaybookPhaseDTO>> {
  try {
    const parsed = addPlaybookPhaseActionSchema.safeParse(input);
    if (!parsed.success) {
      return fail(
        toActionError(ApplicationError.validation(parsed.error.message)),
      );
    }

    const userId = await requireCurrentUserId();
    await assertPlaybookOwnership(input.playbookId, userId);

    const useCase = makeAddPlaybookPhaseUseCase();
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
        ApplicationError.unexpected(error, "Failed to add playbook phase"),
      ),
    );
  }
}

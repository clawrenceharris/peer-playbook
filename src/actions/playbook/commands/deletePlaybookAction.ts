"use server";

import { makeDeletePlaybookUseCase } from "@/composition/playbook";
import {
  DeletePlaybookInput,
  DeletePlaybookResult,
} from "@/features/playbooks/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";
import {
  assertPlaybookOwnership,
  requireCurrentUserId,
} from "../utils/ownership";

const deletePlaybookSchema = z.object({
  id: z.string().uuid(),
});

export async function deletePlaybookAction(
  input: DeletePlaybookInput,
): Promise<ActionResult<DeletePlaybookResult>> {
  try {
    const { error } = deletePlaybookSchema.safeParse(input);
    if (error) {
      return fail(toActionError(ApplicationError.validation(error.message)));
    }
    const userId = await requireCurrentUserId();
    await assertPlaybookOwnership(input.id, userId);

    const useCase = makeDeletePlaybookUseCase();
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
        ApplicationError.unexpected(error, "Failed to delete playbook"),
      ),
    );
  }
}

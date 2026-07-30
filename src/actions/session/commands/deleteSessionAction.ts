"use server";

import {
  assertSessionOwnership,
  requireCurrentUserId,
} from "@/actions/playbook/utils/ownership";
import { makeDeleteSessionUseCase } from "@/composition/session/makeDeleteSessionUseCase";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";

export async function deleteSessionAction(
  sessionId: string,
): Promise<ActionResult<void>> {
  try {
    const userId = await requireCurrentUserId();
    await assertSessionOwnership(sessionId, userId);
    const useCase = makeDeleteSessionUseCase();
    const result = await useCase.execute({ sessionId, userId });
    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(toActionError(error));
    }
    return fail(
      toActionError(
        ApplicationError.unexpected(error, "Failed to delete this session"),
      ),
    );
  }
}

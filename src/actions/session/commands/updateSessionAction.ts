"use server";

import {
  assertSessionOwnership,
  requireCurrentUserId,
} from "@/actions/playbook/utils/ownership";
import { makeUpdateSessionUseCase } from "@/composition/session/makeUpdateSessionUseCase";
import {
  UpdateSessionInput,
  UpdateSessionResult,
} from "@/features/sessions/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";

export async function updateSessionAction(
  input: UpdateSessionInput,
): Promise<ActionResult<UpdateSessionResult>> {
  try {
    const userId = await requireCurrentUserId();
    await assertSessionOwnership(userId, input.sessionId);
    const updateSessionUseCase = makeUpdateSessionUseCase();
    const result = await updateSessionUseCase.execute(input);
    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(toActionError(error));
    }
    return fail(
      toActionError(
        ApplicationError.unexpected("Failed to update this session"),
      ),
    );
  }
}

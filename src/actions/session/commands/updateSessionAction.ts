"use server";

import {
  assertSessionOwnership,
  requireCurrentUserId,
} from "@/actions/playbook/utils/ownership";
import { makeUpdateSessionUseCase } from "@/composition/session/makeUpdateSessionUseCase";
import {
  UpdateSessionResult,
} from "@/features/sessions/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { updateSessionSchema } from "@/lib/validation";
import { z } from "zod";

type UpdateSessionActionInput = {
  sessionId: string;
} & z.input<typeof updateSessionSchema>;

export async function updateSessionAction(
  input: UpdateSessionActionInput,
): Promise<ActionResult<UpdateSessionResult>> {
  try {
    const parsed = updateSessionSchema.safeParse(input);
    if (!parsed.success) {
      return fail(toActionError(ApplicationError.validation(parsed.error.message)));
    }
    const userId = await requireCurrentUserId();
    await assertSessionOwnership(userId, input.sessionId);
    const updateSessionUseCase = makeUpdateSessionUseCase();
    const result = await updateSessionUseCase.execute({
      sessionId: input.sessionId,
      title: parsed.data.title,
      topic: parsed.data.topic,
      courseName: parsed.data.courseName,
      scheduledStart: parsed.data.scheduledStart,
      mode: parsed.data.mode,
    });
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

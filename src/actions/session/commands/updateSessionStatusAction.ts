"use server";

import { makeUpdateSessionStatus } from "@/composition/session";
import { UpdateSessionStatusInput } from "@/features/sessions/application/dto";
import { ApplicationError } from "@/shared/utils/errors";
import { toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import {
  assertSessionOwnership,
  requireCurrentUserId,
} from "@/actions/playbook/utils/ownership";
import z from "zod";

const updateSessionStatusSchema = z.object({
  sessionId: z.uuid().min(1, { error: "Session could not be found" }),
  status: z.enum(["active", "completed", "canceled", "scheduled"], {
    error: "Invalid status",
  }),
});
export async function updateSessionStatusAction(
  input: UpdateSessionStatusInput,
) {
  try {
    const { error } = updateSessionStatusSchema.safeParse(input);
    if (error) {
      const appError = ApplicationError.validation(error.message);
      return fail(toActionError(appError));
    }
    const userId = await requireCurrentUserId();
    await assertSessionOwnership(input.sessionId, userId);
    const useCase = makeUpdateSessionStatus();
    const result = await useCase.execute(input);
    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(toActionError(error));
    }
    return fail(
      toActionError(
        ApplicationError.unexpected(
          error,
          "Failed to update the status of this session",
        ),
      ),
    );
  }
}

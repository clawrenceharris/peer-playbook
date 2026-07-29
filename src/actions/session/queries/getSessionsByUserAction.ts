"use server";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { makeSessionReadService } from "@/composition/session";
import { SessionListItemDTO } from "@/features/sessions/application/dto";

export async function getSessionsByUserAction(
  userId: string,
): Promise<ActionResult<SessionListItemDTO[]>> {
  const sessionService = makeSessionReadService();
  const result = await sessionService.listByUserId(userId);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return result;
}

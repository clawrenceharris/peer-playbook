"use server";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { makeSessionReadService } from "@/composition/session";
import { SessionDetailDTO } from "@/features/sessions/application/dto";

export async function getSessionDetailAction(
  id: string,
): Promise<ActionResult<SessionDetailDTO | null>> {
  const sessionService = makeSessionReadService();
  const result = await sessionService.getDetailById(id);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return result;
}

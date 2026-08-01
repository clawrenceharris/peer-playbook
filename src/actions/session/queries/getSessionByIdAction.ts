"use server";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { makeGetSessionDetailByIdUseCase } from "@/composition/session";
import { SessionDetailDTO } from "@/features/sessions/application/dto";

export async function getSessionDetailAction(
  id: string,
): Promise<ActionResult<SessionDetailDTO | null>> {
  const result = await makeGetSessionDetailByIdUseCase().execute(id);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return result;
}

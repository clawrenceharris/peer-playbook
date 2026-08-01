"use server";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { makeGetSessionByCodeUseCase } from "@/composition/session";
import { SessionDetailDTO } from "@/features/sessions/application/dto";

export async function getSessionByCodeAction(
  code: string,
): Promise<ActionResult<SessionDetailDTO | null>> {
  const result = await makeGetSessionByCodeUseCase().execute(code);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return result;
}

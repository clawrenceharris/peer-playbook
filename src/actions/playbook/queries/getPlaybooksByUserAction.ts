"use server";

import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { makeListUserPlaybooksUseCase } from "@/composition/playbook";
import { PlaybookCardDTO } from "@/features/playbooks/application/dto";

export async function getPlaybooksByUserAction(
  userId: string,
): Promise<ActionResult<PlaybookCardDTO[]>> {
  const result = await makeListUserPlaybooksUseCase().execute(userId);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return result;
}

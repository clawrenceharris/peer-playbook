"use server";

import { makeListPlaybookContextsUseCase } from "@/composition/playbook";
import { SessionContextDTO } from "@/features/playbooks/application/dto";
import { ActionResult } from "@/shared/action";
import { fail } from "@/shared/application";

export async function getSessionContextsAction(): Promise<
  ActionResult<SessionContextDTO[]>
> {
  const result = await makeListPlaybookContextsUseCase().execute();
  if (!result.success) {
    return fail(result.error);
  }
  return result;
}

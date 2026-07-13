"use server";

import { makePlaybookReadService } from "@/composition/playbook";
import { SessionContextDTO } from "@/features/playbooks/application/dto";
import { ActionResult } from "@/shared/action";
import { fail } from "@/shared/application";

export async function getSessionContextsAction(): Promise<
  ActionResult<SessionContextDTO[]>
> {
  const playbookReadService = makePlaybookReadService();
  const result = await playbookReadService.listPlaybookContexts();
  if (!result.success) {
    return fail(result.error);
  }
  return result;
}

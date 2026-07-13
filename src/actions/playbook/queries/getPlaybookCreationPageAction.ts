"use server";
import { makeGetPlaybookCreationPageUseCase } from "@/composition/playbook";
import { GetPlaybookCreationPageOutput } from "@/features/playbooks/application/dto/PlaybookCreationPageDTO";
import { ActionResult } from "@/shared/action";
import { fail } from "@/shared/application";

export async function getPlaybookCreationPageAction(): Promise<
  ActionResult<GetPlaybookCreationPageOutput>
> {
  const getPlaybookCreationPageUseCase = makeGetPlaybookCreationPageUseCase();
  const result = await getPlaybookCreationPageUseCase.execute();
  if (!result.success) {
    return fail(result.error);
  }
  return result;
}

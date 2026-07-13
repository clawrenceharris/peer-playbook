"use server";
import { ApplicationError } from "@/shared/utils";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { makePlaybookReadService } from "@/composition/playbook";
import { PlaybookCardDTO } from "@/features/playbooks/application/dto";

export async function getPlaybooksByUserAction(
  userId: string,
): Promise<ActionResult<PlaybookCardDTO[]>> {
  try {
    const playbookService = makePlaybookReadService();
    const result = await playbookService.listPlaybooksByUserId(userId);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    const appError = ApplicationError.unexpected(
      error,
      "Failed to load playbooks",
    );
    return fail(toActionError(appError));
  }
}

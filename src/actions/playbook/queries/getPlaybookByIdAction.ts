"use server";
import { ApplicationError } from "@/shared/utils";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { makePlaybookReadService } from "@/composition/playbook";
import { PlaybookDetailDTO } from "@/features/playbooks/application/dto";

export async function getPlaybookByIdAction(
  id: string,
): Promise<ActionResult<PlaybookDetailDTO | null>> {
  try {
    const playbookService = makePlaybookReadService();
    const result = await playbookService.getPlaybookDetail(id);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    const appError = ApplicationError.unexpected(
      error,
      "Failed to load playbook",
    );
    return fail(toActionError(appError));
  }
}

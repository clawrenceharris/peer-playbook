"use server";
import { ActionResult, toActionError } from "@/shared/action";
import { makeGetPlaybooksPageUseCase } from "@/composition/playbook";
import { ApplicationError } from "@/shared/utils";
import { fail } from "@/shared/application";
import { PlaybooksPageOutput } from "@/features/playbooks/application/dto/PlaybooksPageDTO";

export async function getPlaybooksPageAction(
  userId: string,
): Promise<ActionResult<PlaybooksPageOutput>> {
  try {
    const getPlaybooksPageUseCase = makeGetPlaybooksPageUseCase();
    const result = await getPlaybooksPageUseCase.execute(userId);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    const appError = ApplicationError.unexpected(
      error,
      "Failed to load this page. Please try again later.",
    );
    return fail(toActionError(appError));
  }
}

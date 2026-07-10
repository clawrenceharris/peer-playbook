"use server";
import { ActionResult, toActionError } from "@/shared/action";
import { makeGetPlaybookPageUseCase } from "@/composition/playbook";
import { ApplicationError } from "@/shared/utils";
import { fail } from "@/shared/application";
import { GetPlaybookPageOutput } from "@/features/playbooks/application/dto/PlaybookPageDTO";
function isValidUUID(id: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    id,
  );
}
export async function getPlaybookPageAction(
  id: string,
): Promise<ActionResult<GetPlaybookPageOutput>> {
  try {
    if (!isValidUUID(id)) {
      return fail(ApplicationError.notFound("Playbook not found"));
    }
    const getPlaybookPageUseCase = makeGetPlaybookPageUseCase();
    const result = await getPlaybookPageUseCase.execute(id);

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

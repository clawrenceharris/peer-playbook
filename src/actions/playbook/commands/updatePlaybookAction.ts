"use server";
import { makeUpdatePlaybookUseCase } from "@/composition/playbook";
import {
  UpdatePlaybookResult,
  UpdatePlaybookInput,
} from "@/features/playbooks/application/dto";
import { updatePlaybookSchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";

export async function updatePlaybookAction(
  input: UpdatePlaybookInput,
): Promise<ActionResult<UpdatePlaybookResult>> {
  try {
    const { error } = updatePlaybookSchema.safeParse(input);
    if (error) {
      const appError = ApplicationError.validation(error.message);
      return fail(toActionError(appError));
    }
    const updatePlaybookUseCase = makeUpdatePlaybookUseCase();
    const result = await updatePlaybookUseCase.execute(input);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    const appError = ApplicationError.unexpected(
      error,
      "Failed to update playbook",
    );
    return fail(toActionError(appError));
  }
}

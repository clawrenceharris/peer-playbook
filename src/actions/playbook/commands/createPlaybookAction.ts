"use server";
import { makeCreatePlaybookUseCase } from "@/composition/playbook";
import {
  CreatePlaybookResult,
  CreatePlaybookInput,
} from "@/features/playbooks/application/dto";
import { createPlaybookSchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";

export async function createPlaybookAction(
  input: CreatePlaybookInput,
): Promise<ActionResult<CreatePlaybookResult>> {
  try {
    const { error } = createPlaybookSchema.safeParse(input);
    if (error) {
      const appError = ApplicationError.validation(error.message);
      return fail(toActionError(appError));
    }
    const createPlaybookUseCase = makeCreatePlaybookUseCase();
    const result = await createPlaybookUseCase.execute(input);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    const appError = ApplicationError.unexpected(
      error,
      "Failed to create playbook",
    );
    return fail(toActionError(appError));
  }
}

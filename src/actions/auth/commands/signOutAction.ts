"use server";
import { ApplicationError } from "@/shared/utils/errors";
import { makeSignOutUserUseCase } from "@/composition/auth";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";

export async function signOutAction(): Promise<ActionResult<void>> {
  try {
    const useCase = await makeSignOutUserUseCase();
    const result = await useCase.execute();
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    console.error("Unexpected sign out action error:", error);
    const appError = ApplicationError.unexpected(error);
    return fail(toActionError(appError));
  }
}

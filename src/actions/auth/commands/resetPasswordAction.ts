"use server";
import { makeResetPasswordUseCase } from "@/composition/auth";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
export async function resetPasswordAction(
  newPassword: string,
): Promise<ActionResult<void>> {
  try {
    const useCase = await makeResetPasswordUseCase();
    const result = await useCase.execute(newPassword);
    if (!result.success) return fail(toActionError(result.error));
    return result;
  } catch (error) {
    const appError = ApplicationError.unexpected(error);
    return fail(toActionError(appError));
  }
}

"use server";
import {
  UpdateProfileResult,
} from "@/features/profile/application/dto";
import { ApplicationError } from "@/shared/utils/errors";
import { makeUpdateProfileUseCase } from "@/composition/profile";
import { fail, ok } from "@/shared/application";
import { toActionError, ActionResult } from "@/shared/action";
import { AppErrorCode } from "@/types/error.types";
import { getCurrentUser } from "../../auth";
import { updateProfileSchema } from "@/lib/validation";
import { z } from "zod";

type UpdateProfileActionInput = {
  id: string;
} & z.input<typeof updateProfileSchema>;

export async function updateProfileAction(
  input: UpdateProfileActionInput,
): Promise<ActionResult<UpdateProfileResult>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return fail(userResult.error);
    }
    if (userResult.data?.id !== input.id) {
      return fail(
        new ApplicationError({ code: AppErrorCode.PERMISSION_DENIED }),
      );
    }

    const parsed = updateProfileSchema.safeParse(input);
    if (!parsed.success) {
      return fail(
        toActionError(
          new ApplicationError({
            code: AppErrorCode.VALIDATION_FAILED,
            message: parsed.error.message,
          }),
        ),
      );
    }
    const useCase = await makeUpdateProfileUseCase();

    const result = await useCase.execute({
      id: input.id,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      courses: parsed.data.courses,
      avatarFile: parsed.data.avatarFile,
    });

    if (!result.success) {
      return fail(result.error);
    }
    return ok(result.data);
  } catch (error) {
    const appError = ApplicationError.unexpected(error);
    return fail(toActionError(appError));
  }
}

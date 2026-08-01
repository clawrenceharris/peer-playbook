"use server"
import { makeSignupUserUseCase } from "@/composition/auth";
import { signUpSchema , type SignUpFormValues } from "@/lib/validation";
import { AppErrorCode } from "@/types/error.types";
import { User } from "@supabase/supabase-js";
import { ApplicationError, logError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";

export async function signupAction(input: SignUpFormValues): Promise<ActionResult<User>> {
    const {data, success, error} = signUpSchema.safeParse(input);
  
    if (!success) {
      const appError = new ApplicationError({ code: AppErrorCode.VALIDATION_FAILED, message: error.issues[0].message });
      return fail(toActionError(appError));
    }  
  
    try {
      const { email, password } = data;
      const useCase = await makeSignupUserUseCase();
      const result = await useCase.execute(email, password);
      if (!result.success) {
        return fail(toActionError(result.error));
      }
      return ok(result.data);
    } catch (error) {
      const appError = ApplicationError.unexpected(error);
      logError(appError, { action: "signupAction" });
      return fail(toActionError(appError));
    }
  }

"use server";
import { makeCreateSessionUseCase } from "@/composition/session/makeCreateSessionUseCase";
import {
  CreateSessionInput,
  CreateSessionResult,
} from "@/features/sessions/application/dto";
import { createSessionSchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";

export async function createSessionAction(
  input: CreateSessionInput,
): Promise<ActionResult<CreateSessionResult>> {
  try {
    const { error } = createSessionSchema.safeParse(input);
    if (error) {
      const appError = ApplicationError.validation(error.message);
      return fail(toActionError(appError));
    }
    const createPlaybookUseCase = makeCreateSessionUseCase();
    const result = await createPlaybookUseCase.execute({
      instructorId: input.instructorId,
      playbookId: input.playbookId,
      scheduledStart: input.scheduledStart,
      mode: input.mode,
      subject: input.subject,
      topic: input.topic,
      courseName: input.courseName,
      description: input.description,
      title: input.title,
    });
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    const appError = ApplicationError.unexpected(
      error,
      "Failed to create session",
    );
    return fail(toActionError(appError));
  }
}

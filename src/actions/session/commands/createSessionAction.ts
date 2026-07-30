"use server";
import { makeCreateSessionUseCase } from "@/composition/session/makeCreateSessionUseCase";
import { CreateSessionResult } from "@/features/sessions/application/dto";
import { createSessionSchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";

type CreateSessionActionInput = {
  instructorId: string;
} & z.input<typeof createSessionSchema>;

export async function createSessionAction(
  input: CreateSessionActionInput,
): Promise<ActionResult<CreateSessionResult>> {
  try {
    const parsed = createSessionSchema.safeParse(input);
    if (!parsed.success) {
      const appError = ApplicationError.validation(parsed.error.message);
      return fail(toActionError(appError));
    }
    const createSessionUseCase = makeCreateSessionUseCase();
    const result = await createSessionUseCase.execute({
      instructorId: input.instructorId,
      playbookId: parsed.data.playbookId,
      scheduledStart: parsed.data.scheduledStart,
      mode: parsed.data.mode,
      subject: parsed.data.subject,
      topic: parsed.data.topic,
      courseName: parsed.data.courseName,
      description: parsed.data.description,
      title: parsed.data.title,
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

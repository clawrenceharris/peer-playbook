"use server";
import { makeUpdatePlaybookUseCase } from "@/composition/playbook";
import {
  UpdatePlaybookResult,
} from "@/features/playbooks/application/dto";
import { updatePlaybookSchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import {
  assertPlaybookOwnership,
  requireCurrentUserId,
} from "../utils/ownership";
import { z } from "zod";

type UpdatePlaybookActionInput = {
  id: string;
} & z.input<typeof updatePlaybookSchema>;

export async function updatePlaybookAction(
  input: UpdatePlaybookActionInput,
): Promise<ActionResult<UpdatePlaybookResult>> {
  try {
    const parsed = updatePlaybookSchema.safeParse(input);
    if (!parsed.success) {
      const appError = ApplicationError.validation(parsed.error.message);
      return fail(toActionError(appError));
    }
    const userId = await requireCurrentUserId();
    await assertPlaybookOwnership(input.id, userId);
    const updatePlaybookUseCase = makeUpdatePlaybookUseCase();
    const result = await updatePlaybookUseCase.execute({
      id: input.id,
      title: parsed.data.title,
      topic: parsed.data.topic,
      courseName: parsed.data.courseName,
      subject: parsed.data.subject,
    });
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(toActionError(error));
    }
    const appError = ApplicationError.unexpected(
      error,
      "Failed to update playbook",
    );
    return fail(toActionError(appError));
  }
}

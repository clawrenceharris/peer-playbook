"use server";
import { makeCreatePlaybookUseCase } from "@/composition/playbook";
import { CreatePlaybookResult } from "@/features/playbooks/application/dto";
import { buildPlaybookSchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";

type CreatePlaybookActionInput = {
  userId: string;
} & z.input<typeof buildPlaybookSchema>;

export async function createPlaybookAction(
  input: CreatePlaybookActionInput,
): Promise<ActionResult<CreatePlaybookResult>> {
  try {
    const parsed = buildPlaybookSchema.safeParse(input);
    if (!parsed.success) {
      const appError = ApplicationError.validation(parsed.error.message);
      return fail(toActionError(appError));
    }

    const createPlaybookUseCase = makeCreatePlaybookUseCase();
    const result = await createPlaybookUseCase.execute({
      userId: input.userId,
      title: parsed.data.title,
      topic: parsed.data.topic,
      subject: parsed.data.subject,
      courseName: parsed.data.courseName,
      contexts: parsed.data.contexts,
      modes: parsed.data.modes,
      instructionalModelId: parsed.data.instructionalModelId,
      warmup: parsed.data.warmup,
      workout: parsed.data.workout,
      closer: parsed.data.closer,
      phases: parsed.data.phases.map((phase) => ({
        title: phase.title,
        intentKey: phase.intentKey,
        templatePhaseKey: phase.templatePhaseKey,
        legacyPhase: phase.legacyPhase,
        position: phase.position,
        strategies: phase.strategies,
      })),
    });
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

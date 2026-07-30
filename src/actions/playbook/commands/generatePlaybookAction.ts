"use server";
import { makeGeneratePlaybookUseCase } from "@/composition/playbook/makeGeneratePlaybookUseCase";
import { CreatePlaybookResult } from "@/features/playbooks/application/dto";
import { generatePlaybookSchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";

type GeneratePlaybookActionInput = {
  userId: string;
} & z.input<typeof generatePlaybookSchema>;

export async function generatePlaybookAction(
  input: GeneratePlaybookActionInput,
): Promise<ActionResult<CreatePlaybookResult>> {
  try {
    const parsed = generatePlaybookSchema.safeParse(input);
    if (!parsed.success) {
      const appError = ApplicationError.validation(parsed.error.message);
      return fail(toActionError(appError));
    }

    const generatePlaybookUseCase = makeGeneratePlaybookUseCase();
    const result = await generatePlaybookUseCase.execute({
      userId: input.userId,
      title: parsed.data.title,
      topic: parsed.data.topic,
      subject: parsed.data.subject,
      courseName: parsed.data.courseName,
      contexts: parsed.data.contexts,
      modes: parsed.data.modes,
      instructions: parsed.data.instructions,
    });
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    const appError = ApplicationError.unexpected(
      error,
      "Failed to generate playbook",
    );
    return fail(toActionError(appError));
  }
}

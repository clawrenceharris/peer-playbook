"use server";
import { makeGeneratePlaybookUseCase } from "@/composition/playbook/makeGeneratePlaybookUseCase";
import { CreatePlaybookResult } from "@/features/playbooks/application/dto";
import { GeneratePlaybookInput } from "@/features/playbooks/application/dto/GeneratePlaybookDTO";
import { generatePlaybookSchema } from "@/lib/validation";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";

export async function generatePlaybookAction(
  input: GeneratePlaybookInput,
): Promise<ActionResult<CreatePlaybookResult>> {
  try {
    const { error } = generatePlaybookSchema.safeParse(input);
    if (error) {
      const appError = ApplicationError.validation(error.message);
      return fail(toActionError(appError));
    }
    const generatePlaybookUseCase = makeGeneratePlaybookUseCase();
    const result = await generatePlaybookUseCase.execute(input);
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

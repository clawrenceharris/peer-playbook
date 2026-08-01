"use server";

import { makeListSavedPlaybookIdsUseCase } from "@/composition/playbook";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";

const getSavedPlaybookIdsSchema = z.object({
  userId: z.string().uuid(),
});

export async function getSavedPlaybookIdsAction(
  userId: string,
): Promise<ActionResult<string[]>> {
  try {
    const { error } = getSavedPlaybookIdsSchema.safeParse({ userId });
    if (error) {
      return fail(toActionError(ApplicationError.validation(error.message)));
    }

    const result = await makeListSavedPlaybookIdsUseCase().execute(userId);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    return fail(
      toActionError(
        ApplicationError.unexpected(error, "Failed to load saved playbooks"),
      ),
    );
  }
}

"use server";

import { db } from "@/db/client";
import { PrismaPlaybookReadRepository } from "@/features/playbooks/infrastructure/repositories";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
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

    const repository = new PrismaPlaybookReadRepository(db);
    const ids = await repository.listSavedPlaybookIdsByUserId(userId);
    return ok(ids);
  } catch (error) {
    return fail(
      toActionError(
        ApplicationError.unexpected(error, "Failed to load saved playbooks"),
      ),
    );
  }
}

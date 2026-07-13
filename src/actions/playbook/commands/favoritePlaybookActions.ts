"use server";

import {
  makeAddFavoritePlaybookUseCase,
  makeRemoveFavoritePlaybookUseCase,
} from "@/composition/playbook";
import {
  FavoritePlaybookInput,
  FavoritePlaybookResult,
} from "@/features/playbooks/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { z } from "zod";
import { requireCurrentUserId } from "../utils/ownership";

const favoritePlaybookSchema = z.object({
  playbookId: z.string().uuid(),
  userId: z.string().uuid(),
});

export async function addFavoritePlaybookAction(
  input: FavoritePlaybookInput,
): Promise<ActionResult<FavoritePlaybookResult>> {
  try {
    const { error } = favoritePlaybookSchema.safeParse(input);
    if (error) {
      return fail(toActionError(ApplicationError.validation(error.message)));
    }
    const userId = await requireCurrentUserId();
    if (input.userId !== userId) {
      return fail(
        toActionError(ApplicationError.permissionDenied()),
      );
    }

    const useCase = makeAddFavoritePlaybookUseCase();
    const result = await useCase.execute(input);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(toActionError(error));
    }
    return fail(
      toActionError(
        ApplicationError.unexpected(error, "Failed to save playbook"),
      ),
    );
  }
}

export async function removeFavoritePlaybookAction(
  input: FavoritePlaybookInput,
): Promise<ActionResult<FavoritePlaybookResult>> {
  try {
    const { error } = favoritePlaybookSchema.safeParse(input);
    if (error) {
      return fail(toActionError(ApplicationError.validation(error.message)));
    }
    const userId = await requireCurrentUserId();
    if (input.userId !== userId) {
      return fail(
        toActionError(ApplicationError.permissionDenied()),
      );
    }

    const useCase = makeRemoveFavoritePlaybookUseCase();
    const result = await useCase.execute(input);
    if (!result.success) {
      return fail(toActionError(result.error));
    }
    return result;
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(toActionError(error));
    }
    return fail(
      toActionError(
        ApplicationError.unexpected(error, "Failed to unsave playbook"),
      ),
    );
  }
}

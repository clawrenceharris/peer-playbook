import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import { FavoritePlaybookInput, FavoritePlaybookResult } from "../dto";

export class AddFavoritePlaybookUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: FavoritePlaybookInput,
  ): Promise<Result<FavoritePlaybookResult>> {
    try {
      await this.playbookRepository.addFavoritePlaybook(
        input.playbookId,
        input.userId,
      );
      return ok({ playbookId: input.playbookId });
    } catch (error) {
      return fail(ApplicationError.unexpected(error, "Failed to save playbook"));
    }
  }
}

export class RemoveFavoritePlaybookUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: FavoritePlaybookInput,
  ): Promise<Result<FavoritePlaybookResult>> {
    try {
      await this.playbookRepository.removeFavoritePlaybook(
        input.playbookId,
        input.userId,
      );
      return ok({ playbookId: input.playbookId });
    } catch (error) {
      return fail(
        ApplicationError.unexpected(error, "Failed to unsave playbook"),
      );
    }
  }
}

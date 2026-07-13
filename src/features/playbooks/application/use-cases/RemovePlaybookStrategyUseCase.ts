import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import { RemovePlaybookStrategyInput } from "../dto";

export class RemovePlaybookStrategyUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: RemovePlaybookStrategyInput,
  ): Promise<Result<void>> {
    try {
      await this.playbookRepository.removePlaybookStrategy({
        playbookId: input.playbookId,
        strategyId: input.strategyId,
      });
      return ok(undefined);
    } catch (error) {
      return fail(
        ApplicationError.unexpected(error, "Failed to remove playbook strategy"),
      );
    }
  }
}


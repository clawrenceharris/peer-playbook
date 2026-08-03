import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, logError } from "@/shared/utils";
import { PlaybookWritePort } from "../ports";
import { UpdatePlaybookPhasesInput, UpdatePlaybookPhasesResult } from "../dto";
import {
  PlaybookPhaseCollection,
  PlaybookPhaseValidationError,
} from "../../domain/entities";

export class UpdatePlaybookPhasesUseCase {
  constructor(private readonly playbookRepository: PlaybookWritePort) {}

  async execute(
    input: UpdatePlaybookPhasesInput,
  ): Promise<Result<UpdatePlaybookPhasesResult>> {
    try {
      const phases = PlaybookPhaseCollection.normalize(input.phases);
      await this.playbookRepository.updatePlaybookPhases({
        playbookId: input.playbookId,
        phases,
      });

      return ok({ playbookId: input.playbookId });
    } catch (error) {
      if (error instanceof PlaybookPhaseValidationError) {
        return fail(ApplicationError.validation(error.message));
      }
      const appError = ApplicationError.unexpected(
        error,
        "Failed to update playbook phases",
      );
      logError(appError, { useCase: "UpdatePlaybookPhasesUseCase" });
      return fail(appError);
    }
  }
}

import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import {
  UpdatePlaybookPhasesInput,
  UpdatePlaybookPhasesResult,
} from "../dto";

export class UpdatePlaybookPhasesUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: UpdatePlaybookPhasesInput,
  ): Promise<Result<UpdatePlaybookPhasesResult>> {
    try {
      await this.playbookRepository.updatePlaybookPhases({
        playbookId: input.playbookId,
        phases: input.phases.map((phase, position) => ({
          ...phase,
          title: phase.title.trim(),
          position,
        })),
      });

      return ok({ playbookId: input.playbookId });
    } catch (error) {
      return fail(
        ApplicationError.unexpected(error, "Failed to update playbook phases"),
      );
    }
  }
}

import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { PlaybookWritePort } from "../ports";
import { UpdatePlaybookPhasesInput, UpdatePlaybookPhasesResult } from "../dto";

export class UpdatePlaybookPhasesUseCase {
  constructor(private readonly playbookRepository: PlaybookWritePort) {}

  async execute(
    input: UpdatePlaybookPhasesInput,
  ): Promise<Result<UpdatePlaybookPhasesResult>> {
    try {
      console.log(input.phases);
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
      console.error(error);
      return fail(
        ApplicationError.unexpected(error, "Failed to update playbook phases"),
      );
    }
  }
}

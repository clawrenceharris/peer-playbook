import { updatePlaybookSchema } from "@/lib/validation";
import { PlaybookWriteRepository } from "../../domain";
import { fail, ok, Result } from "@/shared/application";
import { UpdatePlaybookInput, UpdatePlaybookResult } from "../dto";
import { ApplicationError } from "@/shared/utils";

export class UpdatePlaybookUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: UpdatePlaybookInput,
  ): Promise<Result<UpdatePlaybookResult>> {
    const { id, ...data } = input;
    try {
      const result = await this.playbookRepository.updatePlaybook(id, data);
      return ok(result);
    } catch (error) {
      const appError = ApplicationError.unexpected(
        error,
        "Failed to update playbook",
      );
      return fail(appError);
    }
  }
}

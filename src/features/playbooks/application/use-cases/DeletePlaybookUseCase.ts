import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import { DeletePlaybookInput, DeletePlaybookResult } from "../dto";

export class DeletePlaybookUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: DeletePlaybookInput,
  ): Promise<Result<DeletePlaybookResult>> {
    try {
      await this.playbookRepository.deletePlaybook(input.id);
      return ok({ id: input.id });
    } catch (error) {
      return fail(ApplicationError.unexpected(error, "Failed to delete playbook"));
    }
  }
}

import { ApplicationError, normalizeError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import { PlaybookMapper } from "../../infrastructure/mappers";
import { CreatePlaybookResult } from "../dto";
import { GeneratePlaybookInput } from "../dto/GeneratePlaybookDTO";
import { fail, ok, Result } from "@/shared/application";

export class GeneratePlaybookUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: GeneratePlaybookInput,
  ): Promise<Result<CreatePlaybookResult>> {
    try {
      const { topic, courseName, subject, contexts, instructions, modes } =
        input;

      const result = await this.playbookRepository.generatePlaybook({
        topic,
        courseName: courseName ?? null,
        subject,
        createdBy: input.userId,
        contexts,
        methodology: null, // TODO: Implement methodology generation
        instructions: instructions ?? "",
        modes: modes ?? [],
      });
      return ok(result);
    } catch (error) {
      const appError = ApplicationError.unexpected(
        error,
        "Failed to generate playbook",
      );
      return fail(appError);
    }
  }
}

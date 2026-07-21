import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import { AddPlaybookStrategyInput, PlaybookStrategyCardDTO } from "../dto";

export class AddPlaybookStrategyUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: AddPlaybookStrategyInput,
  ): Promise<Result<PlaybookStrategyCardDTO>> {
    try {
      const result = await this.playbookRepository.createPlaybookStrategy({
        playbookId: input.playbookId,
        playbookPhaseId: input.playbookPhaseId,
        slug: input.slug,
        category: input.category,
        title: input.title,
        description: input.description,
        steps: input.steps,
        phase: input.phase,
        position: input.position,
        sourceId: input.sourceId,
        sourceType: input.sourceType,
        facilitatorNotes: input.facilitatorNotes ?? null,
        estimatedMinutes: input.estimatedMinutes ?? null,
      });
      return ok(result);
    } catch (error) {
      return fail(
        ApplicationError.unexpected(error, "Failed to add playbook strategy"),
      );
    }
  }
}

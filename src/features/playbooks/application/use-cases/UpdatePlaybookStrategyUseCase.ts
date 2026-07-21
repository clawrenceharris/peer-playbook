import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import { PlaybookStrategyCardDTO, UpdatePlaybookStrategyInput } from "../dto";

export class UpdatePlaybookStrategyUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: UpdatePlaybookStrategyInput,
  ): Promise<Result<PlaybookStrategyCardDTO>> {
    const { strategyId } = input;
    const data = {
      ...(input.steps !== undefined && { steps: input.steps }),
      ...(input.title !== undefined && { title: input.title }),
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.phase !== undefined && { phase: input.phase }),
      ...(input.position !== undefined && { position: input.position }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.sourceId !== undefined && { sourceId: input.sourceId }),
      ...(input.sourceType !== undefined && { sourceType: input.sourceType }),
      ...(input.facilitatorNotes !== undefined && {
        facilitatorNotes: input.facilitatorNotes,
      }),
      ...(input.estimatedMinutes !== undefined && {
        estimatedMinutes: input.estimatedMinutes,
      }),
    };

    try {
      const result = await this.playbookRepository.updatePlaybookStrategy(
        strategyId,
        data,
      );
      return ok(result);
    } catch (error) {
      return fail(
        ApplicationError.unexpected(
          error,
          "Failed to update playbook strategy",
        ),
      );
    }
  }
}

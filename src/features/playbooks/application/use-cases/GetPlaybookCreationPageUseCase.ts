import { fail, ok, Result } from "@/shared/application";
import { PlaybookReadRepository } from "../../domain/repositories/PlaybookReadRepository";
import { GetPlaybookCreationPageOutput } from "../dto";
import { PlaybookCreationPageAssembler } from "../assemblers";
import { ApplicationError } from "@/shared/utils";
import { InstructionalModelService } from "@/features/reference-data/instructional-models/services/InstructionalModelService";

export class GetPlaybookCreationPageUseCase {
  constructor(
    private readonly playbookReadRepository: PlaybookReadRepository,
    private readonly instructionalModelService: InstructionalModelService,
  ) {}

  async execute(): Promise<Result<GetPlaybookCreationPageOutput>> {
    try {
      const [contexts, strategies, instructionalModels] = await Promise.all([
        this.playbookReadRepository.listPlaybookContexts(),
        this.playbookReadRepository.listAllStrategies(),
        this.instructionalModelService.getInstructionalModels(),
      ]);
      const input = { contexts, strategies, instructionalModels };
      const output = PlaybookCreationPageAssembler.toPageOutput(input);
      return ok(output);
    } catch (error) {
      console.error("Error loading playbook creation page", error);
      return fail(
        ApplicationError.unexpected(
          error,
          "An unexpected error occurred while loading this page",
        ),
      );
    }
  }
}

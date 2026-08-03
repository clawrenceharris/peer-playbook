import { fail, ok, Result } from "@/shared/application";
import { PlaybookReadPort } from "../ports";
import { GetPlaybookCreationPageOutput } from "../dto";
import { PlaybookCreationPageAssembler } from "../assemblers";
import { ApplicationError, logError } from "@/shared/utils";
import { InstructionalModelService } from "@/features/reference-data/instructional-models/services/InstructionalModelService";

export class GetPlaybookCreationPageUseCase {
  constructor(
    private readonly playbookReadRepository: PlaybookReadPort,
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
      const appError = ApplicationError.unexpected(
        error,
        "An unexpected error occurred while loading this page",
      );
      logError(appError, { useCase: "GetPlaybookCreationPageUseCase" });
      return fail(appError);
    }
  }
}

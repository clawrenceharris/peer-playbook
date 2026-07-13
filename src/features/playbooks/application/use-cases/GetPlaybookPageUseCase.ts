import { fail, ok, Result } from "@/shared/application";
import { PlaybookWriteRepository } from "../../domain";
import { PlaybookReadRepository } from "../../domain/repositories";
import { PlaybookPageAssembler } from "../assemblers/PlaybookPageAssembler";
import { GetPlaybookPageOutput } from "../dto/PlaybookPageDTO";
import { ApplicationError } from "@/shared/utils";
import { ProfileReadRepository } from "@/features/profile/domain/repositories";

export class GetPlaybookPageUseCase {
  constructor(
    private readonly playbookReadRepository: PlaybookReadRepository,
    private readonly profileReadRepository: ProfileReadRepository,
  ) {}

  async execute(id: string): Promise<Result<GetPlaybookPageOutput>> {
    try {
      const [playbook, strategies, phases] = await Promise.all([
        this.playbookReadRepository.findPlaybookDetailById(id),
        this.playbookReadRepository.findPlaybookStrategyDetailsById(id),
        this.playbookReadRepository.findPlaybookPhasesById(id),
      ]);

      if (!playbook) {
        return fail(ApplicationError.notFound("Playbook not found"));
      }

      const creator = await this.profileReadRepository.findProfileDetailById(
        playbook.createdBy,
      );
      if (!playbook || !creator) {
        return fail(ApplicationError.notFound("Playbook not found"));
      }
      return ok(
        PlaybookPageAssembler.toPageDTO({
          playbook,
          strategies,
          phases,
          creator,
        }),
      );
    } catch (error) {
      console.error("Error loading playbook page:", error);
      return fail(
        ApplicationError.unexpected(
          error,
          "An error occurred while loading this page. Please try again later.",
        ),
      );
    }
  }
}

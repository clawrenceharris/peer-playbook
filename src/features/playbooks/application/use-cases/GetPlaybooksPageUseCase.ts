import { ProfileReadRepository } from "@/features/profile/domain/repositories";
import { PlaybookReadRepository } from "../../domain/repositories/PlaybookReadRepository";
import { PlaybooksPageAssembler } from "../assemblers/PlaybooksPageAssembler";
import {
  PlaybookPageInput,
  PlaybooksPageOutput,
} from "../dto/PlaybooksPageDTO";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
type GetPlaybooksPageUseCaseResult = Result<PlaybooksPageOutput>;

export class GetPlaybooksPageUseCase {
  constructor(
    private readonly playbookReadRepository: PlaybookReadRepository,
    private readonly profileReadRepository: ProfileReadRepository,
  ) {}
  async execute(userId: string): Promise<GetPlaybooksPageUseCaseResult> {
    const playbooks =
      await this.playbookReadRepository.listPlaybooksByUserId(userId);
    const profile =
      await this.profileReadRepository.findProfileCardById(userId);
    if (!profile) {
      return fail(ApplicationError.notFound("User not found"));
    }
    const playbooksPageInput: PlaybookPageInput = {
      userId,
      playbooks: playbooks.map((playbook) => ({
        ...playbook,
        creator: {
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          id: profile.id,
        },
      })),
    };
    return ok(PlaybooksPageAssembler.toOutput(playbooksPageInput));
  }
}

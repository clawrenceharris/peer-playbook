import { ProfileReadPort } from "@/features/profile/application/ports";
import { PlaybookReadPort } from "../ports";
import { PlaybooksPageAssembler } from "../assemblers/PlaybooksPageAssembler";
import {
  GetPlaybooksPageInput,
  PlaybooksPageOutput,
} from "../dto/PlaybooksPageDTO";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
type GetPlaybooksPageUseCaseResult = Result<PlaybooksPageOutput>;

export class GetPlaybooksPageUseCase {
  constructor(
    private readonly playbookReadRepository: PlaybookReadPort,
    private readonly profileReadRepository: ProfileReadPort,
  ) {}
  async execute(userId: string): Promise<GetPlaybooksPageUseCaseResult> {
    const playbooks =
      await this.playbookReadRepository.listPlaybooksByUserId(userId);
    const profile =
      await this.profileReadRepository.findProfileCardById(userId);
    if (!profile) {
      return fail(ApplicationError.notFound("User not found"));
    }
    const playbooksPageInput: GetPlaybooksPageInput = {
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

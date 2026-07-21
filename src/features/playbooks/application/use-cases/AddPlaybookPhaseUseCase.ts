import { fail, ok, Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { PlaybookWriteRepository } from "../../domain";
import {
  toLegacyPhase,
  toPhaseIntentKey,
} from "../../domain/phase-intent.mapping";
import { AddPlaybookPhaseInput, PlaybookPhaseDTO } from "../dto";

export class AddPlaybookPhaseUseCase {
  constructor(private readonly playbookRepository: PlaybookWriteRepository) {}

  async execute(
    input: AddPlaybookPhaseInput,
  ): Promise<Result<PlaybookPhaseDTO>> {
    try {
      const result = await this.playbookRepository.createPlaybookPhase(
        input.playbookId,
        {
          title: input.title,
          position: input.position,
          intentKey: toPhaseIntentKey(input.intent),
          strategies: [],
          legacyPhase: toLegacyPhase(input.intent),
        },
      );
      return ok(result);
    } catch (error) {
      return fail(
        ApplicationError.unexpected(error, "Failed to add playbook phase"),
      );
    }
  }
}

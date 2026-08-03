import { PlaybookWritePort } from "../ports";
import { fail, ok, Result } from "@/shared/application";
import { UpdatePlaybookInput, UpdatePlaybookResult } from "../dto";
import { ApplicationError } from "@/shared/utils";
import {
  PlaybookMetadataValidationError,
  PlaybookTitle,
  PlaybookTopic,
} from "../../domain/value-objects";

export class UpdatePlaybookUseCase {
  constructor(private readonly playbookRepository: PlaybookWritePort) {}

  async execute(
    input: UpdatePlaybookInput,
  ): Promise<Result<UpdatePlaybookResult>> {
    const { id, ...data } = input;
    try {
      const result = await this.playbookRepository.updatePlaybook(id, {
        ...data,
        ...(data.title !== undefined && {
          title: PlaybookTitle.create(data.title).value,
        }),
        ...(data.topic !== undefined && {
          topic: PlaybookTopic.create(data.topic).value,
        }),
      });
      return ok(result);
    } catch (error) {
      if (error instanceof PlaybookMetadataValidationError) {
        return fail(ApplicationError.validation(error.message));
      }
      const appError = ApplicationError.unexpected(
        error,
        "Failed to update playbook",
      );
      return fail(appError);
    }
  }
}

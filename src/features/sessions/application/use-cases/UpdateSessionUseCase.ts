import { ApplicationError } from "@/shared/utils";
import { UpdateSessionInput, UpdateSessionResult } from "../dto";
import { fail, ok, Result } from "@/shared/application";
import { SessionWritePort } from "../ports";

type UpdateSessionUseCaseResult = Result<UpdateSessionResult, ApplicationError>;
export class UpdateSessionUseCase {
  constructor(private readonly sessionRepository: SessionWritePort) {}

  async execute(
    input: UpdateSessionInput,
  ): Promise<UpdateSessionUseCaseResult> {
    try {
      const data = {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.topic !== undefined && { topic: input.topic }),
        ...(input.courseName !== undefined && { courseName: input.courseName }),
        ...(input.scheduledStart !== undefined && {
          scheduledStart: input.scheduledStart,
        }),
        ...(input.mode !== undefined && { mode: input.mode }),
      };
      const result = await this.sessionRepository.updateSession(
        input.sessionId,
        data,
      );
      return ok(result);
    } catch (error) {
      const appError = ApplicationError.unexpected(
        error,
        "Failed to update session",
      );
      return fail(appError);
    }
  }
}

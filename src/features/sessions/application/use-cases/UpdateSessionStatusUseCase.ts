import { ApplicationError } from "@/shared/utils";
import { SessionStatus } from "../../domain/value-objects";
import { UpdateSessionStatusInput, UpdateSessionStatusResult } from "../dto";
import { fail, ok, Result } from "@/shared/application";
import { SessionReadPort, SessionWritePort } from "../ports";

type UpdateSessionStatusUseCaseResult = Result<
  UpdateSessionStatusResult,
  ApplicationError
>;
export class UpdateSessionStatusUseCase {
  constructor(
    private readonly sessionWriteRepository: SessionWritePort,
    private readonly sessionReadRepository: SessionReadPort,
  ) {}

  async execute(
    input: UpdateSessionStatusInput,
  ): Promise<UpdateSessionStatusUseCaseResult> {
    try {
      const session = await this.sessionReadRepository.findCardById(
        input.sessionId,
      );
      if (!session) {
        return fail(ApplicationError.notFound("Session not found"));
      }
      const updatedSession =
        await this.sessionWriteRepository.updateSessionStatus({
          sessionId: input.sessionId,
          status: input.status as SessionStatus,
        });
      return ok(updatedSession);
    } catch (error) {
      return fail(
        ApplicationError.unexpected(
          error,
          "Failed to update the status for this session",
        ),
      );
    }
  }
}

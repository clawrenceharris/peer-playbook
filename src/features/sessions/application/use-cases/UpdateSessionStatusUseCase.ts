import { ApplicationError } from "@/shared/utils";
import {
  InvalidSessionTransitionError,
  Session,
} from "../../domain/entities/Session";
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
      const session = await this.sessionReadRepository.findDetailById(
        input.sessionId,
      );
      if (!session) {
        return fail(ApplicationError.notFound("Session not found"));
      }
      const sessionEntity = new Session({
        id: session.id,
        instructorId: session.instructorId,
        playbookId: session.playbookId,
        title: session.title,
        scheduledStart: session.scheduledStart,
        mode: session.mode,
        subject: session.subject,
        topic: session.topic,
        courseName: session.courseName,
        description: session.description,
        status: session.status,
        createdAt: session.createdAt,
      });
      const transitionedSession = sessionEntity.transitionTo(
        input.status as SessionStatus,
      );
      const updatedSession =
        await this.sessionWriteRepository.updateSessionStatus({
          sessionId: input.sessionId,
          status: transitionedSession.status,
        });
      return ok(updatedSession);
    } catch (error) {
      if (error instanceof InvalidSessionTransitionError) {
        return fail(ApplicationError.validation(error.message));
      }
      return fail(
        ApplicationError.unexpected(
          error,
          "Failed to update the status for this session",
        ),
      );
    }
  }
}

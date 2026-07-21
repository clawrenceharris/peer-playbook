import { fail, ok, Result } from "@/shared/application";
import {
  CreateSessionInput,
  CreateSessionResult,
} from "../dto/CreateSessionDTO";
import { SessionWriteRepository } from "../../domain/repositories/SessionWriteRepository";
import { SessionMode, SessionStatus } from "../../domain/value-objects";
import { Session } from "../../domain/entities/Session";
import { ApplicationError } from "@/shared/utils";

type CreateSessionUseCaseResult = Result<CreateSessionResult>;
export class CreateSessionUseCase {
  constructor(private readonly sessionRepository: SessionWriteRepository) {}

  async execute(
    input: CreateSessionInput,
  ): Promise<CreateSessionUseCaseResult> {
    try {
      const session = new Session({
        id: crypto.randomUUID(),
        instructorId: input.instructorId,
        playbookId: input.playbookId ?? null,
        title: input.title,
        scheduledStart: input.scheduledStart,
        mode: input.mode as SessionMode,
        subject: input.subject ?? null,
        topic: input.topic ?? null,
        courseName: input.courseName ?? null,
        description: input.description ?? null,
        status: SessionStatus.SCHEDULED,
      });
      const result = await this.sessionRepository.createSession({
        playbookId: session.playbookId,
        title: session.title,
        instructorId: session.instructorId,
        scheduledStart: session.scheduledStart,
        mode: session.mode,
        subject: session.subject,
        topic: session.topic,
        courseName: session.courseName,
        description: session.description,
        status: session.status,
      });

      return ok(result);
    } catch (error) {
      const appError = ApplicationError.unexpected(
        error,
        "Failed to create session",
      );
      return fail(appError);
    }
  }
}

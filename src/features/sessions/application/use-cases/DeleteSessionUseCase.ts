import { fail, ok, Result } from "@/shared/application";
import { SessionWritePort } from "../ports";
import { ApplicationError } from "@/shared/utils";
import { DeleteSessionInput } from "../dto";

export class DeleteSessionUseCase {
  constructor(
    private readonly sessionWriteRepository: SessionWritePort,
  ) {}
  async execute({ sessionId }: DeleteSessionInput): Promise<Result<void>> {
    try {
      await this.sessionWriteRepository.deleteSession(sessionId);
      return ok(undefined);
    } catch (error) {
      return fail(
        ApplicationError.unexpected(error, "Failed to delete this session"),
      );
    }
  }
}

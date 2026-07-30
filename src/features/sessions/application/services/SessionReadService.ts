import { fail, ok, Result } from "@/shared/application";
import { normalizeError } from "@/shared/utils";
import { SessionDetailDTO, SessionListItemDTO } from "../dto";
import { SessionReadPort } from "../ports";

export class SessionReadService {
  constructor(private readonly readRepository: SessionReadPort) {}

  async getByCode(code: string): Promise<Result<SessionDetailDTO | null>> {
    try {
      return ok(await this.readRepository.findByCode(code));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async listByUserId(
    userId: string,
  ): Promise<Result<SessionListItemDTO[]>> {
    try {
      return ok(await this.readRepository.listByUserId(userId));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async getDetailById(
    sessionId: string,
  ): Promise<Result<SessionDetailDTO | null>> {
    try {
      return ok(await this.readRepository.findDetailById(sessionId));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

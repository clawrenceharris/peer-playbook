import { fail, ok, Result } from "@/shared/application";
import { normalizeError } from "@/shared/utils";
import { SessionDetailDTO, SessionListItemDTO } from "../dto";
import { SessionReadPort } from "../ports";

export class GetSessionByCodeUseCase {
  constructor(private readonly sessions: SessionReadPort) {}

  async execute(code: string): Promise<Result<SessionDetailDTO | null>> {
    try {
      return ok(await this.sessions.findByCode(code));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

export class GetSessionDetailByIdUseCase {
  constructor(private readonly sessions: SessionReadPort) {}

  async execute(id: string): Promise<Result<SessionDetailDTO | null>> {
    try {
      return ok(await this.sessions.findDetailById(id));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

export class ListUserSessionsUseCase {
  constructor(private readonly sessions: SessionReadPort) {}

  async execute(userId: string): Promise<Result<SessionListItemDTO[]>> {
    try {
      return ok(await this.sessions.listByUserId(userId));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

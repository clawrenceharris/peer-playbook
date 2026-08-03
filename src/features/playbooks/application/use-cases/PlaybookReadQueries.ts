import { fail, ok, Result } from "@/shared/application";
import { normalizeError } from "@/shared/utils";
import { PlaybookCardDTO, PlaybookDetailDTO, SessionContextDTO } from "../dto";
import { PlaybookReadPort } from "../ports";

export class ListUserPlaybooksUseCase {
  constructor(private readonly playbooks: PlaybookReadPort) {}

  async execute(userId: string): Promise<Result<PlaybookCardDTO[]>> {
    try {
      return ok(await this.playbooks.listPlaybooksByUserId(userId));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

export class GetPlaybookDetailUseCase {
  constructor(private readonly playbooks: PlaybookReadPort) {}

  async execute(id: string): Promise<Result<PlaybookDetailDTO | null>> {
    try {
      return ok(await this.playbooks.findPlaybookDetailById(id));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

export class ListPlaybookContextsUseCase {
  constructor(private readonly playbooks: PlaybookReadPort) {}

  async execute(): Promise<Result<SessionContextDTO[]>> {
    try {
      return ok(await this.playbooks.listPlaybookContexts());
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

export class ListSavedPlaybookIdsUseCase {
  constructor(private readonly playbooks: PlaybookReadPort) {}

  async execute(userId: string): Promise<Result<string[]>> {
    try {
      return ok(await this.playbooks.listSavedPlaybookIdsByUserId(userId));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

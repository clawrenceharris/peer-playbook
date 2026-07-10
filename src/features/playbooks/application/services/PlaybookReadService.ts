import { fail, ok, Result } from "@/shared/application";
import { PlaybookReadRepository } from "../../domain/repositories";
import {
  PlaybookCardDTO,
  PlaybookDetailDTO,
  PlaybookStrategyCardDTO,
  PlaybookStrategyDetailDTO,
  SessionContextDTO,
} from "../dto";
import { normalizeError } from "@/shared/utils";
import { Playbook } from "../../domain";

export class PlaybookReadService {
  constructor(
    private readonly playbookReadRepository: PlaybookReadRepository,
  ) {}
  async listPlaybooksByUserId(
    userId: string,
  ): Promise<Result<PlaybookCardDTO[]>> {
    try {
      const playbooks =
        await this.playbookReadRepository.listPlaybooksByUserId(userId);
      return ok(playbooks);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async getPlaybookDetail(
    playbookId: string,
  ): Promise<Result<PlaybookDetailDTO | null>> {
    try {
      const playbook =
        await this.playbookReadRepository.findPlaybookDetailById(playbookId);
      return ok(playbook);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async listPlaybookStrategyCards(
    playbookId: string,
  ): Promise<Result<PlaybookStrategyCardDTO[]>> {
    try {
      const strategies =
        await this.playbookReadRepository.findPlaybookStrategyCardsById(
          playbookId,
        );
      return ok(strategies);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async listPlaybookStrategyDetails(
    playbookId: string,
  ): Promise<Result<PlaybookStrategyDetailDTO[]>> {
    try {
      const strategies =
        await this.playbookReadRepository.findPlaybookStrategyDetailsById(
          playbookId,
        );
      return ok(strategies);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async listPlaybookContexts(): Promise<Result<SessionContextDTO[]>> {
    try {
      const contexts = await this.playbookReadRepository.listPlaybookContexts();
      return ok(contexts);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

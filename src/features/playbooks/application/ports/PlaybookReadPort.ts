import {
  PlaybookCardDTO,
  PlaybookDetailDTO,
  PlaybookPagePhaseDTO,
  PlaybookStrategyCardDTO,
  PlaybookStrategyDetailDTO,
  SessionContextDTO,
} from "../dto";

/**
 * Read-side gateway for playbook use cases. Its return values are application
 * read models, so it belongs at the application boundary rather than domain.
 */
export interface PlaybookReadPort {
  listPlaybookContexts(): Promise<SessionContextDTO[]>;
  findPlaybookPhasesById(playbookId: string): Promise<PlaybookPagePhaseDTO[]>;
  findPlaybookStrategyDetailsById(
    playbookId: string,
  ): Promise<PlaybookStrategyDetailDTO[]>;
  listAllStrategies(): Promise<PlaybookStrategyDetailDTO[]>;
  findPlaybookStrategyCardsById(
    playbookId: string,
  ): Promise<PlaybookStrategyCardDTO[]>;
  findPlaybookDetailById(id: string): Promise<PlaybookDetailDTO | null>;
  listPlaybooks(): Promise<PlaybookCardDTO[]>;
  listPlaybooksByUserId(userId: string): Promise<PlaybookCardDTO[]>;
  listSavedPlaybookIdsByUserId(userId: string): Promise<string[]>;
}

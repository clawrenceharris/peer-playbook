import {
  PlaybookCardDTO,
  PlaybookDetailDTO,
  PlaybookPagePhaseDTO,
  PlaybookStrategyCardDTO,
  PlaybookStrategyDetailDTO,
} from "../../application/dto";
import { SessionContextDTO } from "../../application/dto/SessionContextDTO";

export interface PlaybookReadRepository {
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
}

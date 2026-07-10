import {
  PlaybookCardDTO,
  PlaybookDetailDTO,
  PlaybookStrategyCardDTO,
  CreatePlaybookResult,
} from "../../application/dto";
import {
  CreatePlaybookCommand,
  GeneratePlaybookCommand,
  UpdatePlaybookPhasesCommand,
  UpdatePlaybookCommand,
  UpdatePlaybookStrategyCommand,
} from "../types";

export interface PlaybookWriteRepository {
  createPlaybook(data: CreatePlaybookCommand): Promise<CreatePlaybookResult>;
  generatePlaybook(
    data: GeneratePlaybookCommand,
  ): Promise<CreatePlaybookResult>;

  updatePlaybook(
    id: string,
    data: UpdatePlaybookCommand,
  ): Promise<PlaybookCardDTO>;
  updatePlaybookPhases(data: UpdatePlaybookPhasesCommand): Promise<void>;
  deletePlaybook(id: string): Promise<void>;
  addFavoritePlaybook(playbookId: string, userId: string): Promise<void>;
  removeFavoritePlaybook(playbookId: string, userId: string): Promise<void>;
  updatePlaybookStrategy(
    strategyId: string,
    data: UpdatePlaybookStrategyCommand,
  ): Promise<PlaybookStrategyCardDTO>;
}

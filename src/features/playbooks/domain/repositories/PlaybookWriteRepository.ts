import {
  PlaybookCardDTO,
  PlaybookStrategyCardDTO,
  CreatePlaybookResult,
} from "../../application/dto";
import {
  CreatePlaybookCommand,
  GeneratePlaybookCommand,
  CreatePlaybookStrategyCommand,
  UpdatePlaybookPhasesCommand,
  UpdatePlaybookCommand,
  UpdatePlaybookStrategyCommand,
  RemovePlaybookStrategyCommand,
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
  createPlaybookStrategy(
    data: CreatePlaybookStrategyCommand,
  ): Promise<PlaybookStrategyCardDTO>;
  removePlaybookStrategy(data: RemovePlaybookStrategyCommand): Promise<void>;
  deletePlaybook(id: string): Promise<void>;
  addFavoritePlaybook(playbookId: string, userId: string): Promise<void>;
  removeFavoritePlaybook(playbookId: string, userId: string): Promise<void>;
  updatePlaybookStrategy(
    strategyId: string,
    data: UpdatePlaybookStrategyCommand,
  ): Promise<PlaybookStrategyCardDTO>;
}

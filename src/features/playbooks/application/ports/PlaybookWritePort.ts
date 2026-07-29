import {
  CreatePlaybookResult,
  PlaybookCardDTO,
  PlaybookPhaseDTO,
  PlaybookStrategyCardDTO,
} from "../dto";
import {
  CreatePlaybookCommand,
  CreatePlaybookPhaseCommand,
  CreatePlaybookStrategyCommand,
  GeneratePlaybookCommand,
  RemovePlaybookStrategyCommand,
  UpdatePlaybookCommand,
  UpdatePlaybookPhasesCommand,
  UpdatePlaybookStrategyCommand,
} from "../../domain/types";

/**
 * Write-side gateway for playbook use cases. It deliberately uses application
 * result shapes instead of making the domain depend on DTOs.
 */
export interface PlaybookWritePort {
  createPlaybookPhase(
    playbookId: string,
    data: CreatePlaybookPhaseCommand,
  ): Promise<PlaybookPhaseDTO>;
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

import { SupabaseClient } from "@supabase/supabase-js";
import { PlaybooksRepository } from "../data/playbook.repository";
import {
  Playbook,
  PlaybookInsert,
  PlaybookStrategy,
  PlaybookStrategyUpdate,
  PlaybookUpdate,
  PlaybookWithStrategies,
} from "./playbook.types";
import {
  CreatePlaybookFormValues,
  GeneratePlaybookFormValues,
} from "./playbook.schema";

export const createPlaybookService = (client: SupabaseClient) => {
  const repository = new PlaybooksRepository(client);

  const getAll = () => repository.getAll();
  const getById = (playbookId: string) => repository.getById(playbookId);
  const getAllByUser = (userId: string) =>
    repository.getAllBy("createdBy", userId);

  const getPlaybookWithStrategies = async (
    playbookId: string,
  ): Promise<PlaybookWithStrategies> => {
    const playbook = await repository.getById(playbookId);
    const strategies = await repository.getPlaybookStrategies(playbookId);
    return { ...playbook, strategies };
  };
  const getFavoritePlaybooks = (userId: string) =>
    repository.getFavoritePlaybooks(userId);
  const getFavoritePlaybookIds = (userId: string): Promise<string[]> =>
    repository.getFavoritePlaybookIds(userId);
  const getPlaybookStrategies = (playbookId: string) =>
    repository.getPlaybookStrategies(playbookId);

  const createPlaybook = (data: PlaybookInsert): Promise<Playbook> =>
    repository.create(data);
  const addFavoritePlaybook = (playbookId: string, userId: string) =>
    repository.addFavoritePlaybook(playbookId, userId);
  const removeFavoritePlaybook = (playbookId: string, userId: string) =>
    repository.removeFavoritePlaybook(playbookId, userId);

  const update = (
    playbookId: string,
    data: PlaybookUpdate,
  ): Promise<Playbook> => repository.update(playbookId, data);

  const updateStrategySteps = (strategyId: string, steps: string[]) =>
    repository.updatePlaybookStrategy(strategyId, { steps });

  const updatePlaybookStrategy = (
    strategyId: string,
    data: PlaybookStrategyUpdate,
  ): Promise<PlaybookStrategy> =>
    repository.updatePlaybookStrategy(strategyId, data);

  const deletePlaybook = (playbookId: string): Promise<void> =>
    repository.delete(playbookId);

  const deletePlaybookStrategy = (strategyId: string): Promise<void> =>
    repository.deletePlaybookStrategy(strategyId);

  const generatePlaybook = async (
    data: GeneratePlaybookFormValues,
  ): Promise<Playbook> => {
    const response = await fetch("/api/playbooks/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: data.subject,
        course_name: data.courseName,
        topic: data.topic,
        modes: data.modes,
        instructions: data.instructions,
        contexts: data.contexts,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Failed to generate playbook");
    }

    return repository.getById(payload.playbookId);
  };

  const createManualPlaybook = async (
    data: CreatePlaybookFormValues,
  ): Promise<Playbook> => {
    const response = await fetch("/api/playbooks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: data.subject,
        course_name: data.courseName,
        topic: data.topic,
        modes: data.modes,
        contexts: data.contexts,
        strategies: {
          warmup: data.warmup,
          workout: data.workout,
          closer: data.closer,
        },
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Failed to create playbook");
    }

    return repository.getById(payload.playbookId);
  };
  const reorderStrategies = async (
    strategies: PlaybookStrategy[],
  ): Promise<void> => {
    await Promise.all(
      strategies.map((strategy, index) =>
        repository.updatePlaybookStrategy(strategy.id, { position: index }),
      ),
    );
  };

  return {
    getAll,
    getById,
    getAllByUser,
    getPlaybookWithStrategies,
    getPlaybookStrategies,
    getFavoritePlaybooks,
    getFavoritePlaybookIds,
    createPlaybook,
    addFavoritePlaybook,
    removeFavoritePlaybook,
    update,
    updateStrategySteps,
    updatePlaybookStrategy,
    deletePlaybook,
    deletePlaybookStrategy,
    generatePlaybook,
    createManualPlaybook,
    reorderStrategies,
  };
};

export type PlaybookService = ReturnType<typeof createPlaybookService>;

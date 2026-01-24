import { SupabaseClient } from "@supabase/supabase-js";
import { CreateStrategyInput } from "@/types/strategies";
import { StrategiesRepository } from "../data";
import { Strategy, StrategyInsert } from "./strategy.types";

export const createStrategyService = (client: SupabaseClient) => {
  const repository = new StrategiesRepository(client);

  const getAll = () => repository.getAll();
  const getById = (strategyId: string) => repository.getById(strategyId);

  const publishStrategy = (strategyId: string, isPublished: boolean) =>
    repository.update(strategyId, {
      isPublished,
      publishedAt: isPublished ? new Date().toISOString() : null,
    });

  const createStrategy = (
    userId: string,
    input: CreateStrategyInput
  ): Promise<Strategy> => {
    const insertData: StrategyInsert = {
      title: input.title,
      description: input.description,
      steps: input.steps,
      sessionSize: input.sessionSize || "2+",
      virtualFriendly: input.virtualFriendly ?? true,
      courseTags: input.courseTags || [],
      goodFor: input.goodFor || [],
      createdBy: userId,
      isSystem: false,
      isPublished: false,
    };

    return repository.create(insertData);
  };

  const saveStrategy = (userId: string, strategyId: string) =>
    repository.saveStrategy(userId, strategyId);

  const unsaveStrategy = (userId: string, strategyId: string) =>
    repository.unsaveStrategy(userId, strategyId);

  const isSaved = (userId: string, strategyId: string): Promise<boolean> =>
    repository.isSaved(userId, strategyId);

  const getSavedStrategyIds = (userId: string): Promise<string[]> =>
    repository.getSavedStrategyIds(userId);

  const getSystemStrategies = async (): Promise<Strategy[]> => {
    const strategies = await repository.getSystemStrategies();
    return strategies.map((strategy) => ({
      ...strategy,
      isSystem: strategy.isSystem ?? true,
    }));
  };

  const getByIds = (strategyIds: string[]): Promise<Strategy[]> =>
    repository.getByIds(strategyIds);

  return {
    getAll,
    getById,
    publishStrategy,
    createStrategy,
    saveStrategy,
    unsaveStrategy,
    isSaved,
    getSavedStrategyIds,
    getSystemStrategies,
    getByIds,
  };
};

export type StrategyService = ReturnType<typeof createStrategyService>;

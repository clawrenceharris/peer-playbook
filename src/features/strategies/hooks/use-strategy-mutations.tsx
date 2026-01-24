import { DefaultError } from "@tanstack/react-query";
import { useStrategyService } from "./use-strategy-service";
import { useDomainMutation } from "@/lib/queries";
import { strategyKeys, StrategyService } from "../domain";

export const useSaveStrategy = () =>
  useDomainMutation<
    StrategyService,
    void,
    DefaultError,
    { strategyId: string; userId: string }
  >(useStrategyService, {
    mutationFn: (strategyService, { strategyId, userId }) =>
      strategyService.saveStrategy(userId, strategyId),
    invalidateFn: (_, { strategyId, userId }) =>
      [
        ...strategyKeys.lists(),
        strategyKeys.saved(userId),
        strategyKeys.detail(strategyId),
      ] as const,
  });

export const useUnsaveStrategy = () =>
  useDomainMutation<
    StrategyService,
    void,
    DefaultError,
    { strategyId: string; userId: string }
  >(useStrategyService, {
    mutationFn: (strategyService, { strategyId, userId }) =>
      strategyService.unsaveStrategy(userId, strategyId),
    invalidateFn: (_, { strategyId, userId }) => [
      ...strategyKeys.lists(),
      strategyKeys.saved(userId),
      strategyKeys.detail(strategyId),
    ],
  });

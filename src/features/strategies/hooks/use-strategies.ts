import { useQuery } from "@tanstack/react-query";
import { Strategy } from "@/features/strategies/domain";
import { useStrategyService } from "./";
import {
  selectSortedStrategies,
  selectPublishedStrategies,
  selectSystemStrategies,
  selectRecentStrategies,
  selectSavedStrategiesFromIds,
} from "../selectors/strategy.selectors";
import { strategyKeys } from "../domain/strategy.keys";

/**
 * Base hook to fetch all strategies with optional selector
 * @param select - Optional selector function to transform the data
 * @returns React Query result with transformed data
 */
export const useStrategies = <TSelected = Strategy[]>(
  select?: (strategies: Strategy[]) => TSelected
) => {
  const strategyService = useStrategyService();
  return useQuery({
    queryKey: strategyKeys.all,
    queryFn: () => strategyService.getAll(),
    select,
  });
};

/**
 * Hook to fetch strategies sorted by creation date (newest first)
 */
export const useSortedStrategies = <TSelected = Strategy[]>(
  select?: (strategies: Strategy[]) => TSelected
) => {
  return useStrategies((s) => {
    const sorted = selectSortedStrategies(s);
    return select ? select(sorted) : (sorted as unknown as TSelected);
  });
};

/**
 * Hook to fetch published strategies only
 */
export const usePublishedStrategies = <TSelected = Strategy[]>(
  select?: (strategies: Strategy[]) => TSelected
) => {
  return useStrategies((s) => {
    const published = selectPublishedStrategies(s);
    return select ? select(published) : (published as unknown as TSelected);
  });
};

/**
 * Hook to fetch system strategies only
 */
export const useSystemStrategies = <TSelected = Strategy[]>(
  select?: (strategies: Strategy[]) => TSelected
) => {
  return useStrategies((s) => {
    const system = selectSystemStrategies(s);
    return select ? select(system) : (system as unknown as TSelected);
  });
};

/**
 * Hook to fetch recent N strategies
 * @param count - Number of recent strategies to return
 */
export const useRecentStrategies = (count: number = 10) => {
  return useStrategies(selectRecentStrategies(count));
};

/**
 * Hook to fetch saved strategy IDs for a user
 * @param userId - The user ID
 * @param select - Optional selector function to transform the data
 */
export const useMySavedStrategies = <TSelected = string[]>(
  userId: string,
  select?: (ids: string[]) => TSelected
) => {
  const strategyService = useStrategyService();
  return useQuery({
    queryKey: strategyKeys.saved(userId),
    queryFn: () => strategyService.getSavedStrategyIds(userId),
    select,
    enabled: !!userId,
  });
};

/**
 * Hook to fetch full strategy objects for user's saved strategies
 * Combines saved IDs with all strategies
 * @param userId - The user ID
 */
export const useMySavedStrategiesWithDetails = (userId: string) => {
  const savedIdsQuery = useMySavedStrategies(userId);

  return useStrategies((strategies) => {
    if (!savedIdsQuery.data) return [];
    return selectSavedStrategiesFromIds(savedIdsQuery.data)(strategies);
  });
};

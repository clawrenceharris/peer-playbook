import { useQuery } from "@tanstack/react-query";
import { useStrategyService } from "./";
import { strategyKeys } from "../domain/strategy.keys";

/**
 * Hook to fetch a single strategy by ID
 * @param strategyId - The strategy ID
 */
export const useStrategy = (strategyId: string) => {
  const strategyService = useStrategyService();
  return useQuery({
    queryKey: strategyKeys.detail(strategyId),
    queryFn: () => strategyService.getById(strategyId),
    enabled: !!strategyId,
  });
};

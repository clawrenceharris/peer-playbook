import { useQuery } from "@tanstack/react-query";
import type { UserStrategy } from "@/features/strategies/domain";
import { userStrategyKeys } from "@/features/strategies/domain";
import { useUserStrategyService } from "./use-user-strategy-service";

/**
 * Fetch all user strategies (admin/debug use). Prefer `useMyUserStrategies`.
 */
export const useUserStrategies = <TSelected = UserStrategy[]>(
  select?: (strategies: UserStrategy[]) => TSelected,
) => {
  const service = useUserStrategyService();
  return useQuery({
    queryKey: userStrategyKeys.all,
    queryFn: () => service.getAll(),
    select,
  });
};

/**
 * Fetch user strategies created by a specific owner.
 */
export const useMyUserStrategies = <TSelected = UserStrategy[]>(
  ownerId: string,
  select?: (strategies: UserStrategy[]) => TSelected,
) => {
  const service = useUserStrategyService();
  return useQuery({
    queryKey: userStrategyKeys.byOwner(ownerId),
    queryFn: () => service.getAllByOwner(ownerId),
    enabled: !!ownerId,
    select,
  });
};


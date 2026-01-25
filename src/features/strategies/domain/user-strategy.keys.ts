/**
 * Query key factory for user_strategies domain
 */
export const userStrategyKeys = {
  all: ["user-strategies"] as const,
  lists: () => [...userStrategyKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...userStrategyKeys.lists(), { filters }] as const,
  details: () => [...userStrategyKeys.all, "detail"] as const,
  detail: (id: string) => [...userStrategyKeys.details(), id] as const,
  byOwner: (ownerId: string) => [...userStrategyKeys.all, "owner", ownerId] as const,
} as const;


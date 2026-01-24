/**
 * Query key factory for strategies domain
 * Provides a centralized, type-safe way to manage React Query keys
 *
 */
export const strategyKeys = {
  all: ["strategies"] as const,
  lists: () => [...strategyKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...strategyKeys.lists(), { filters }] as const,
  details: () => [...strategyKeys.all, "detail"] as const,
  detail: (id: string) => [...strategyKeys.details(), id] as const,
  byPlaybook: (playbookId: string) =>
    [...strategyKeys.all, "playbook", playbookId] as const,
  byUser: (userId: string) => [...strategyKeys.all, "user", userId] as const,

  saved: (userId: string) => [...strategyKeys.all, "saved", userId] as const,
  published: () => [...strategyKeys.all, "published"] as const,
  system: () => [...strategyKeys.all, "system"] as const,
  contexts: (strategyId: string) =>
    [...strategyKeys.detail(strategyId), "contexts"] as const,
} as const;

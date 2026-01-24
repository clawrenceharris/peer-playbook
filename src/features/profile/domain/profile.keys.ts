/**
 * Query key factory for profile domain
 * Provides a centralized, type-safe way to manage React Query keys
 */
export const profileKeys = {
  all: ["profiles"] as const,
  lists: () => [...profileKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...profileKeys.lists(), { filters }] as const,
  details: () => [...profileKeys.all, "detail"] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
} as const;

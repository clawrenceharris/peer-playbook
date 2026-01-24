/**
 * Query key factory for sessions domain
 * Provides a centralized, type-safe way to manage React Query keys
 */
export const sessionKeys = {
  all: ["sessions"] as const,
  lists: () => [...sessionKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...sessionKeys.lists(), { filters }] as const,
  paginated: () => [...sessionKeys.all, "paginated"] as const,
  paginatedList: (
    page: number,
    limit: number,
    filters?: Record<string, unknown>
  ) => [...sessionKeys.paginated(), { page, limit, filters }] as const,
  details: () => [...sessionKeys.all, "detail"] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
  byLeader: (leaderId: string) =>
    [...sessionKeys.all, "leader", leaderId] as const,
  byStatus: (status: string) => [...sessionKeys.all, "status", status] as const,
  contexts: (sessionId: string) =>
    [...sessionKeys.detail(sessionId), "contexts"] as const,
} as const;

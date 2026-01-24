export const playbookKeys = {
    all: ["playbooks"] as const,
    lists: () => [...playbookKeys.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...playbookKeys.lists(), { filters }] as const,
    details: () => [...playbookKeys.all, "detail"] as const,
    detail: (id: string) => [...playbookKeys.details(), id] as const,
  byUser: (userId: string) => [...playbookKeys.all, "user", userId] as const,
  } as const;
  
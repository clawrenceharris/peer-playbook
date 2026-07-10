export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  user: () => [...authKeys.all, "user"] as const,
  mutations: {
    signup: () => [...authKeys.all, "mutation", "signup"] as const,
    login: () => [...authKeys.all, "mutation", "login"] as const,
    signOut: () => [...authKeys.all, "mutation", "signout"] as const,
    resetPassword: () =>
      [...authKeys.all, "mutation", "reset-password"] as const,
    updatePassword: () =>
      [...authKeys.all, "mutation", "update-password"] as const,
    reauthenticate: () =>
      [...authKeys.all, "mutation", "reauthenticate"] as const,
  },
};

export const profileKeys = {
  all: ["profiles"] as const,
  lists: () => [...profileKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...profileKeys.lists(), { filters }] as const,
  details: () => [...profileKeys.all, "detail"] as const,
  detail: (id: string, shape: "base" | "detail" | "card" = "base") =>
    [...profileKeys.details(), id, shape] as const,
} as const;

export const playbookKeys = {
  all: ["playbooks"] as const,
  lists: () => [...playbookKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...playbookKeys.lists(), { filters }] as const,
  details: () => [...playbookKeys.all, "detail"] as const,
  detail: (id: string) => [...playbookKeys.details(), id] as const,

  byUserId: (userId: string) => [...playbookKeys.all, "user", userId] as const,
  favorite: () => [...playbookKeys.all, "favorite"],
} as const;

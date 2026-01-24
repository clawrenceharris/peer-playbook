
export const authKeys = {
    all: ["auth"] as const,
    session: () => [...authKeys.all, "session"] as const,
    user: () => [...authKeys.all, "user"] as const,
    mutations: {
      signup: () => [...authKeys.all, "mutation", "signup"] as const,
      login: () => [...authKeys.all, "mutation", "login"] as const,
      signOut: () => [...authKeys.all, "mutation", "signout"] as const,
      resetPassword: () => [...authKeys.all, "mutation", "reset-password"] as const,
      updatePassword: () =>
        [...authKeys.all, "mutation", "update-password"] as const,
      reauthenticate: () =>
        [...authKeys.all, "mutation", "reauthenticate"] as const,
    },
  };
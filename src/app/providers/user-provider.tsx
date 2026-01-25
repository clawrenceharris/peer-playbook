"use client";
import React from "react";
import { createContext, useContext } from "react";

import { ErrorState, LoadingState } from "@/components/states";
import { Profile } from "@/features/profile/domain";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/features/profile/hooks";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: loadingAuth } = useAuth();

  // IMPORTANT: only fetch profile when we actually have a user id
  const {
    data: profile,
    refetch,
    isLoading: loadingProfile,
  } = useProfile(user?.id);

  const router = useRouter();
  const pathname = usePathname();

  if (loadingAuth || loadingProfile) return <LoadingState />;

  // signed out
  if (!user) {
    // If we're already on an auth route, just render it
    if (pathname.includes("auth")) return <>{children}</>;
    // Otherwise, let middleware navigate user to login

    return <LoadingState />;
  }

  // only an error when authenticated user exists but profile doesn't
  if (!profile) {
    if (pathname.includes("auth")) return <>{children}</>;

    return (
      <ErrorState
        title="Couldn't find your account"
        message="There doesn't seem to be a profile associated with your account."
        onRetry={refetch}
        retryLabel="Retry"
        actionLabel="Log In"
        onAction={() => router.replace("/")}
      />
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export type AppUser = { user: User; profile: Profile };

const UserContext = createContext<AppUser | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}

import { useState, useEffect, useCallback } from "react";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserErrorMessage } from "@/utils/error";
import { authKeys, LoginFormInput, SignUpFormInput } from "../domain";
import { supabase } from "@/lib/supabase/client";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: authKeys.session(),
    queryFn: async (): Promise<Session | null> => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const userQuery = useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User | null> => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Keep query cache in sync with auth session changes (single source of truth).
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (e: AuthChangeEvent, session: Session | null) => {
        try {
          queryClient.setQueryData(authKeys.session(), session);
          queryClient.setQueryData(authKeys.user(), session?.user ?? null);
          setError(null);
        } catch (error) {
          setError(getUserErrorMessage(error));
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Also bridge session -> user for initial load (in case onAuthStateChange doesn't fire immediately).
  useEffect(() => {
    if (sessionQuery.data !== undefined) {
      queryClient.setQueryData(
        authKeys.user(),
        sessionQuery.data?.user ?? null,
      );
    }
  }, [queryClient, sessionQuery.data]);

  const signupMutation = useMutation({
    mutationKey: authKeys.mutations.signup(),
    mutationFn: async (data: SignUpFormInput) => {
      const { email, password } = data;
      const { data: res, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });
      if (error) throw error;
      return res;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(authKeys.session(), res.session ?? null);
      queryClient.setQueryData(authKeys.user(), res.user ?? null);
      setError(null);
    },
    onError: (err) => setError(getUserErrorMessage(err)),
  });

  // Sign up new user
  const signup = useCallback(
    async (data: SignUpFormInput): Promise<User | null> => {
      const res = await signupMutation.mutateAsync(data);
      return res.user ?? null;
    },
    [signupMutation],
  );

  const loginMutation = useMutation({
    mutationKey: authKeys.mutations.login(),
    mutationFn: async (data: LoginFormInput) => {
      const { email, password } = data;
      const { data: res, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return res;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(authKeys.session(), res.session ?? null);
      queryClient.setQueryData(authKeys.user(), res.user ?? null);
      setError(null);
    },
    onError: (err) => setError(getUserErrorMessage(err)),
  });

  // Sign in existing user
  const login = useCallback(
    async (data: LoginFormInput): Promise<User | null> => {
      const res = await loginMutation.mutateAsync(data);
      return res.user ?? null;
    },
    [loginMutation],
  );

  const signOutMutation = useMutation({
    mutationKey: authKeys.mutations.signOut(),
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session(), null);
      queryClient.setQueryData(authKeys.user(), null);
      setError(null);
    },
    onError: (err) => setError(getUserErrorMessage(err)),
  });

  // Sign out current user
  const signOut = useCallback(async (): Promise<void> => {
    await signOutMutation.mutateAsync();
  }, [signOutMutation]);

  const resetPasswordMutation = useMutation({
    mutationKey: authKeys.mutations.resetPassword(),
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    },
    onSuccess: () => setError(null),
    onError: (err) => setError(getUserErrorMessage(err)),
  });

  // Send password reset email
  const resetPassword = useCallback(
    async (email: string): Promise<void> => {
      await resetPasswordMutation.mutateAsync(email);
    },
    [resetPasswordMutation],
  );

  const updatePasswordMutation = useMutation({
    mutationKey: authKeys.mutations.updatePassword(),
    mutationFn: async (newPassword: string) => {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return data.user ?? null;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user(), user);
      setError(null);
    },
    onError: (err) => setError(getUserErrorMessage(err)),
  });

  // Update user password
  const updatePassword = useCallback(
    async (newPassword: string): Promise<void> => {
      await updatePasswordMutation.mutateAsync(newPassword);
    },
    [updatePasswordMutation],
  );

  const reauthenticateMutation = useMutation({
    mutationKey: authKeys.mutations.reauthenticate(),
    mutationFn: async () => {
      // Supabase returns { data, error } for most auth ops; be defensive.
      const result = await supabase.auth.reauthenticate();
      if (result && typeof result === "object" && "error" in result) {
        const err = (result as { error?: unknown }).error;
        if (err) throw err;
      }
    },
    onSuccess: () => setError(null),
    onError: (err) => setError(getUserErrorMessage(err)),
  });

  // Reauthenticate user
  const reauthenticate = useCallback(async (): Promise<void> => {
    try {
      await reauthenticateMutation.mutateAsync();
    } catch (error) {
      setError(getUserErrorMessage(error));
    }
  }, [reauthenticateMutation]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
    signupMutation.reset();
    loginMutation.reset();
    signOutMutation.reset();
    resetPasswordMutation.reset();
    updatePasswordMutation.reset();
    reauthenticateMutation.reset();
  }, [
    loginMutation,
    reauthenticateMutation,
    resetPasswordMutation,
    signOutMutation,
    signupMutation,
    updatePasswordMutation,
  ]);

  const user = (userQuery.data ?? null) as User | null;
  const isLoading = sessionQuery.isLoading || userQuery.isLoading;

  // Check if user is authenticated
  const isAuthenticated = user != null;

  // Check if user has verified email

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,

    // Actions
    signup,
    login,
    signOut,
    resetPassword,
    updatePassword,
    reauthenticate,
    clearError,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;

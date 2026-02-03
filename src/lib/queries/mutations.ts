/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  DefaultError,
  QueryClient,
  QueryKey,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { DomainMutationOptions } from "./types";
import { useCallback, useState } from "react";
import { AppError } from "@/types/errors";
import { normalizeError } from "@/utils";

/**
 * Configuration for a single query update in a multi-query optimistic update
 */
export interface QueryUpdateConfig<TVariables> {
  /** Function that returns the query key for this query (can use variables) */
  getKey: (variables: TVariables) => QueryKey;
  /** Function that updates the query data (receives old data and variables) */
  updater: (oldData: any, variables: TVariables) => any;
}

/**
 * Configuration for multi-query optimistic updates
 */
export interface MultiQueryOptimisticUpdateConfig<TVariables, TContext> {
  /** Query key to cancel before updating (usually a base key like ['playbooks']) */
  cancelKey: QueryKey;
  /** Array of query configurations to update */
  queries: QueryUpdateConfig<TVariables>[];
  /** Optional function to create custom context from snapshots */
  createContext?: (
    snapshots: Record<string, any>,
    variables: TVariables
  ) => TContext;
}

/**
 * Creates optimistic update handlers (onMutate and onError) for mutations that need
 * to update multiple queries. Handles cancellation, snapshotting, updating, and rollback.
 *
 * @example
 * ```typescript
 * const { onMutate, onError } = createMultiQueryOptimisticUpdate({
 *   cancelKey: playbookKeys.all,
 *   queries: [
 *     {
 *       getKey: (vars) => playbookKeys.detail(vars.id),
 *       updater: (old, vars) => ({ ...old, favorite: vars.favorite }),
 *     },
 *     {
 *       getKey: (vars) => playbookKeys.byUser(userId),
 *       updater: (old, vars) => old?.map(p => p.id === vars.id ? { ...p, favorite: vars.favorite } : p),
 *     },
 *   ],
 * });
 * ```
 */
export function createMultiQueryOptimisticUpdate<
  TVariables,
  TContext = Record<string, unknown>
>(
  queryClient: QueryClient,
  config: MultiQueryOptimisticUpdateConfig<TVariables, TContext>
) {
  const { cancelKey, queries, createContext } = config;

  const onMutate = async (variables: TVariables): Promise<TContext> => {
    // Cancel all queries matching the cancel key
    await queryClient.cancelQueries({ queryKey: cancelKey });

    // Snapshot previous values for all queries
    const snapshots: Record<string, any> = {};
    for (const query of queries) {
      const key = query.getKey(variables);
      const keyStr = JSON.stringify(key);
      snapshots[keyStr] = queryClient.getQueryData(key);
    }

    // Optimistically update all queries
    for (const query of queries) {
      const key = query.getKey(variables);
      const oldData = snapshots[JSON.stringify(key)];

      // Only update if data exists
      if (oldData !== undefined) {
        const newData = query.updater(oldData, variables);
        queryClient.setQueryData(key, newData);
      }
    }

    // Return context (either custom or snapshots)
    if (createContext) {
      return createContext(snapshots, variables);
    }
    return snapshots as TContext;
  };

  const onError = (
    err: unknown,
    variables: TVariables,
    context: unknown
  ): void => {
    // Rollback all queries to their previous values
    if (context) {
      const ctx = context as TContext;
      const snapshots =
        ctx instanceof Object && "snapshots" in ctx
          ? (ctx as Record<string, unknown>).snapshots
          : ctx;

      if (typeof snapshots === "object" && snapshots !== null) {
        for (const query of queries) {
          const key = query.getKey(variables);
          const keyStr = JSON.stringify(key);
          const previousData = (snapshots as Record<string, unknown>)[keyStr];

          if (previousData !== undefined) {
            queryClient.setQueryData(key, previousData);
          }
        }
      }
    }
  };

  return { onMutate, onError };
}

/**
 * Hook to handle mutation errors with modal support
 * Useful for components that need custom error handling
 */
export function useMutationError() {
  const [error, setError] = useState<AppError | null>(null);
  const [errorContext, setErrorContext] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);

  const handleError = useCallback((error: unknown, context?: string) => {
    const normalizedError = normalizeError(error);
    setError(normalizedError);
    setErrorContext(context);
    setShowModal(true);
  }, []);

  const showErrorModal = useCallback((error: AppError, context?: string) => {
    setError(error);
    setErrorContext(context);
    setShowModal(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrorContext(undefined);
    setShowModal(false);
  }, []);

  return {
    error,
    errorContext,
    showModal,
    handleError,
    showErrorModal,
    clearError,
    // ErrorDetailModal props for rendering in component
    errorModalProps: error
      ? {
          error,
          open: showModal,
          onOpenChange: setShowModal,
          context: errorContext,
        }
      : null,
  };
}

/*
 * Generic mutation hook that works with any service
 * @param useService - Hook that returns the service instance
 * @param options - Mutation options with service-injected mutationFn
 */
export function useDomainMutation<
  TService,
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
>(
  useService: () => TService,

  options: DomainMutationOptions<TService, TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const queryClient = useQueryClient();
  const service = useService();

  return useMutation({
    ...options,
    meta: options.meta,

    // Wrap the mutationFn to inject service
    mutationFn: (variables: TVariables) =>
      options.mutationFn(service, variables),

    // Use custom onMutate if provided, otherwise use default optimistic update
    onMutate: async (variables) => {
      if (!options.queryKey) return {} as TContext;
      if (options.updater === undefined) return {} as TContext;

      // Cancel outgoing refetches (so they don't overwrite our update)
      await queryClient.cancelQueries({ queryKey: options.queryKey });

      const previousData = queryClient.getQueriesData({
        queryKey: options.queryKey,
      });

      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: options.queryKey, exact: false },
        (old: any) => {
          return options.updater ? options.updater(old, variables) : old;
        }
      );

      return { previousData } as TContext;
    },
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
      if (options.invalidateFn) {
        const key = options.invalidateFn(data, variables, context);
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
    onError:
      options.onError ||
      ((err, variables, context) => {
        const previousData = (context as { previousData: any })?.previousData;

        // Rollback to previous state on error (only if using default updater)
        if (previousData && options.queryKey && !options.onMutate) {
          queryClient.setQueryData(options.queryKey, previousData);
        }
      }),
  });
}

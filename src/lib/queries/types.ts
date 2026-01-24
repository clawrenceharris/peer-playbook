/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DefaultError,
  QueryKey,
  UseMutationOptions,
} from "@tanstack/react-query";

export interface InvalidationOptions {
  exact?: boolean;
  type?: "all" | "active" | "inactive";
}

// Generic mutation options type
export type DomainMutationOptions<
  TService,
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  "mutationFn" | "onSuccess" | "onMutate"
> & {
  queryKey?: QueryKey;
  updater?: (oldData: any, newVariables: TVariables) => any;
  // mutationFn receives service as first parameter
  mutationFn: (service: TService, variables: TVariables) => Promise<TData>;
  // function that returns query keys to invalidate
  invalidateFn?: (
    data: TData,
    variables: TVariables,
    context: TContext
  ) => QueryKey;

  // Options for invalidation behavior
  invalidationOptions?: InvalidationOptions;
  // Optional custom onSuccess handler
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext
  ) => void | Promise<void>;
  // optimistic update handler
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext;
};

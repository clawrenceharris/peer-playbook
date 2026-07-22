"use client";
import { showErrorToast } from "@/lib/errors/error-toast";
import { ApplicationError } from "@/shared/utils/errors";
import { normalizeError } from "@/shared/utils/errors";
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

const isDevelopment = process.env.NODE_ENV === "development";
const queryStaleTime = isDevelopment ? 30 * 60 * 1000 : 5 * 60 * 1000;
const queryGcTime = isDevelopment ? 60 * 60 * 1000 : 10 * 60 * 1000;

/**
 * Owns the app-wide QueryClient configuration and rehydrates any server-side
 * prefetched data. The defaults intentionally reduce noisy refetches during
 * development because many queries ultimately hit server actions and the DB.
 */
export function QueryProvider({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: queryStaleTime,
          gcTime: queryGcTime,
          retry: (failureCount, error) => {
            // Don't retry on client errors (4xx)
            if (error && typeof error === "object" && "status" in error) {
              const status = (error as any).status;
              if (status >= 400 && status < 500) {
                return false;
              }
            }
            // Dev refreshes should not multiply server-action/database calls.
            return failureCount < (isDevelopment ? 1 : 3);
          },
          retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),
          refetchOnMount: isDevelopment ? false : "always",
          refetchOnWindowFocus: false,
          refetchOnReconnect: !isDevelopment,
        },

        mutations: {
          onError: (error) => {
            // Normalize the error
            const normalizedError = normalizeError(error);

            // Show toast with "See More" action
            // The actual modal opening will be handled via mutation observer
            // Show toast with "See More" action
            showErrorToast(normalizedError, {
              onShowDetails: () => {
                // Mutation errors can originate outside the component tree that
                // rendered the toast, so the modal bridge is exposed globally.
                if (typeof window !== "undefined") {
                  const errorHandler = (
                    window as {
                      __showErrorModal?: (
                        error: ApplicationError,
                        context?: string
                      ) => void;
                    }
                  ).__showErrorModal;
                  if (errorHandler) {
                    errorHandler(normalizedError);
                  }
                }
              },
            });
          },
        },
      },
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>

      <ReactQueryDevtools hideDisabledQueries />
    </QueryClientProvider>
  );
}

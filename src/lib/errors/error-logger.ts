import { AppError } from "@/types/errors";

/**
 * Centralized error logging
 * Development: Logs to console
 * Production: Sends to Sentry (configured separately)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logError(error: AppError, context?: Record<string, any>) {
  const errorLog = {
    timestamp: error.timestamp,
    code: error.code,
    category: error.category,
    severity: error.severity,
    message: error.message,
    userMessage: error.userMessage,
    canRetry: error.canRetry,
    metadata: error.metadata,
    context,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "server",
    stack: error.stack,
  };

  // Development: Log to console with full details
  if (process.env.NODE_ENV === "development") {
    console.error("App Error:", errorLog);

    // Log additional context if available
    if (context) {
      console.error("Error Context:", context);
    }
  }

  // Production: Send to Sentry (will be initialized separately)
  if (process.env.NODE_ENV === "production") {
    // Dynamically import Sentry to avoid breaking dev builds
    if (typeof window !== "undefined") {
      import("@sentry/nextjs")
        .then((Sentry) => {
          Sentry.captureException(error, {
            contexts: {
              app: {
                error_code: error.code,
                category: error.category,
                severity: error.severity,
                can_retry: error.canRetry,
                user_message: error.userMessage,
              },
            },
            tags: {
              error_code: error.code,
              category: error.category,
              severity: error.severity,
            },
            extra: {
              ...errorLog,
              context,
            },
          });
        })
        .catch(() => {
          // Sentry not available, silently fail
        });
    }
  }
}

import { ApplicationError } from "@/shared/utils/errors";

/**
 * Centralized error logging
 * Development: Logs to console
 * Production: Sends to Sentry (configured separately)
 */
export function logError(
  error: ApplicationError,
  context?: Record<string, any>,
) {
  const errorLog = {
    code: error.code,
    title: "Something went wrong",
    message: error.message,
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
                title: "Something went wrong",
                message: error.message,
              },
            },
            tags: {
              error_code: error.code,
              title: "Something went wrong",
              message: error.message,
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

/**
 * Sentry initialization and configuration
 * This is imported by the Sentry config files at the root
 */

// Dynamically import Sentry to avoid breaking builds when package is not installed

/**
 * Initialize Sentry with Next.js SDK
 * Called from sentry.client.config.ts and sentry.server.config.ts
 * Note: This is a no-op if Sentry is not installed
 */
export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Dynamic import to avoid breaking builds
    import("@sentry/nextjs")
      .then((Sentry) => {
        Sentry.init({
          dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
          environment: process.env.NODE_ENV,
          tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

          // Filter out known non-critical errors
          beforeSend(event, hint) {
            const error = hint.originalException;

            // Don't send network errors that are expected (offline, timeout)
            if (error && typeof error === "object" && "code" in error) {
              const errorCode = (error as { code: string }).code;
              if (
                errorCode === "network_offline" ||
                errorCode === "network_timeout"
              ) {
                return null; // Don't send to Sentry
              }
            }

            return event;
          },

          // Configure error filtering
          ignoreErrors: [
            // Browser extensions
            /Extension context invalidated/,
            /ResizeObserver loop/,
            // Network errors that are user-related
            /NetworkError/,
            /fetch failed/,
          ],
        });
      })
      .catch(() => {
        // Sentry not available, silently fail
      });
  }
}

/**
 * Set user context for Sentry
 * Note: This is a no-op if Sentry is not installed
 */
export function setSentryUser(
  user: { id: string; email?: string; name?: string } | null
) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Dynamic import to avoid breaking builds
    import("@sentry/nextjs")
      .then((Sentry) => {
        Sentry.setUser(
          user
            ? {
                id: user.id,
                email: user.email,
                username: user.name,
              }
            : null
        );
      })
      .catch(() => {
        // Sentry not available, silently fail
      });
  }
}

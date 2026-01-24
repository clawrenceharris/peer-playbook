// This file is only used when Sentry is installed
// Dynamically import to avoid breaking builds

// Only initialize if Sentry DSN is configured
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  // @ts-expect-error - Sentry may not be installed
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV || "development",
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
      
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
    });
  }).catch(() => {
    // Sentry not installed, silently fail
  });
}


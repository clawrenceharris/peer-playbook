import { SessionContexts } from "@/types";

/**
 * Groups playbook contexts by their key
 */
export const selectContextsByKey = (
  contexts: SessionContexts[]
): Record<string, SessionContexts> =>
  contexts.reduce((acc, context) => {
    acc[context.key] = context;
    return acc;
  }, {} as Record<string, SessionContexts>);

/**
 * Groups playbook contexts by their ID
 */
export const selectContextsById = (
  contexts: SessionContexts[]
): Record<string, SessionContexts> =>
  contexts.reduce((acc, context) => {
    acc[context.id] = context;
    return acc;
  }, {} as Record<string, SessionContexts>);

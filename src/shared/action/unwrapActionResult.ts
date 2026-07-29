import { ActionResult } from "./ActionError";

/**
 * React Query mutation hooks use this helper to convert a serializable action
 * result back into the normal throw-on-failure control flow expected by
 * mutationFn implementations.
 */
export function unwrapActionResult<T>(result: ActionResult<T>): T {
  if (!result.success) {
    throw result.error;
  }

  return result.data;
}

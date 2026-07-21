import { ActionResult } from "./ActionError";

export function unwrapActionResult<T>(result: ActionResult<T>): T {
  if (!result.success) {
    throw result.error;
  }

  return result.data;
}

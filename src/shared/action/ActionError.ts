import { AppErrorCode } from "@/types";

export type ActionError = {
  code: AppErrorCode;
  message: string;
  field?: string;
};

/**
 * Server actions return this serializable wire format so client hooks can
 * inspect predictable `success/data/error` fields without relying on thrown
 * class instances crossing the network boundary.
 */
export type ActionResult<TData> =
  | {
      success: true;
      data: TData;
    }
  | {
      success: false;
      error: ActionError;
    };

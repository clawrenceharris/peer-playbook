import { AppError } from "@/types/errors";
import { supabase } from "../supabase/client";

export interface BugReport {
  error_code: string;
  error_message: string;
  user_message?: string;
  technical_details?: Record<string, unknown>;
  user_description?: string;
  steps_to_reproduce?: string;
  user_agent?: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Submits a bug report to the database
 */
export async function submitBugReport(
  error: AppError,
  additionalData?: {
    userDescription?: string;
    stepsToReproduce?: string;
    userId?: string;
  }
): Promise<{ success: boolean; error?: unknown }> {
  try {
    const bugReport: BugReport = {
      error_code: error.code,
      error_message: error.message,
      user_message: error.userMessage,
      technical_details: {
        code: error.code,
        category: error.category,
        severity: error.severity,
        canRetry: error.canRetry,
        metadata: error.metadata,
        stack: error.stack,
        timestamp: error.timestamp.toISOString(),
      },
      user_description: additionalData?.userDescription,
      steps_to_reproduce: additionalData?.stepsToReproduce,
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      metadata: {
        ...error.metadata,
      },
    };

    const { error: dbError } = await supabase
      .from("bug_reports")
      .insert({
        ...bugReport,
        user_id: additionalData?.userId || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Failed to submit bug report:", dbError);
      return { success: false, error: dbError };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting bug report:", error);
    return { success: false, error };
  }
}

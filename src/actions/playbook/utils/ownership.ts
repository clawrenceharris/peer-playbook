import { db } from "@/db/client";
import { ApplicationError } from "@/shared/utils";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireCurrentUserId(): Promise<string> {
  const client = await createServerSupabaseClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw ApplicationError.permissionDenied("You need to sign in first.");
  }

  return user.id;
}

export async function assertPlaybookOwnership(
  playbookId: string,
  userId: string,
): Promise<void> {
  const playbook = await db.playbooks.findUnique({
    where: { id: playbookId },
    select: { created_by: true },
  });

  if (!playbook || playbook.created_by !== userId) {
    throw ApplicationError.permissionDenied();
  }
}

export async function assertStrategyOwnership(
  strategyId: string,
  userId: string,
): Promise<void> {
  const strategy = await db.playbook_strategies.findUnique({
    where: { id: strategyId },
    select: {
      playbooks: { select: { created_by: true } },
    },
  });

  if (!strategy || strategy.playbooks.created_by !== userId) {
    throw ApplicationError.permissionDenied();
  }
}

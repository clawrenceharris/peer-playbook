"use server";
import React from "react";

import { LibraryPageClient } from "./LibraryPageClient";
import { getPlaybooksPageAction } from "@/actions/playbook/queries/getPlaybooksPageAction";
import { ErrorState } from "@/components/states";
import { requireCurrentUserId } from "@/actions/playbook/utils/ownership";
import { ApplicationError } from "@/shared/utils/errors";

export default async function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userId: string | null = null;
  try {
    userId = await requireCurrentUserId();
  } catch (error) {
    if (error instanceof ApplicationError) {
      return (
        <ErrorState
          variant="card"
          title="Error loading this page"
          message={error.message}
        />
      );
    }
    return (
      <ErrorState
        variant="card"
        title="Error loading this page"
        message="An unexpected error occurred. Please try again later."
      />
    );
  }

  const playbooksPageResult = await getPlaybooksPageAction(userId);
  if (!playbooksPageResult.success) {
    return (
      <ErrorState
        variant="card"
        title="Error loading playbooks"
        message={playbooksPageResult.error.message}
      />
    );
  }
  const playbooksPage = playbooksPageResult.data;
  return (
    <>
      <LibraryPageClient playbooksPage={playbooksPage} />
      <div hidden>{children}</div>
    </>
  );
}

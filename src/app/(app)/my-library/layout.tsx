"use server";
import React from "react";

import { LibraryPageClient } from "./LibraryPageClient";
import { getPlaybooksPageAction } from "@/actions/playbook/queries/getPlaybooksPageAction";
import { getCurrentUser } from "@/actions/auth";
import { ErrorState } from "@/components/states";

export default async function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userResult = await getCurrentUser();
  if (!userResult.success) {
    return (
      <ErrorState
        variant="card"
        title="Error loading your account"
        message={userResult.error.message}
      />
    );
  }
  const user = userResult.data;
  if (!user) {
    return (
      <ErrorState
        variant="card"
        title="Access denied"
        message="You are not authorized to access this page. Pleas log in to continue."
      />
    );
  }
  const playbooksPageResult = await getPlaybooksPageAction(user.id);
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

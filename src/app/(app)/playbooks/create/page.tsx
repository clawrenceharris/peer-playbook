"use server";
import React from "react";
import CreatePlaybookPage from "./CreatePlaybookPage";
import { getPlaybookCreationPageAction } from "@/actions/playbook";
import { notFound } from "next/navigation";
import { ErrorState } from "@/components/states";
import { getUserErrorMessage } from "@/shared/utils";

export default async function Page() {
  const result = await getPlaybookCreationPageAction();
  if (!result.success) {
    return (
      <ErrorState
        variant="card"
        title="Error loading playbook creation page"
        message={result.error.message}
      />
    );
  }
  return <CreatePlaybookPage page={result.data} />;
}

"use server";
import CreatePlaybookPageClient from "./CreatePlaybookPageClient";
import { getPlaybookCreationPageAction } from "@/actions/playbook";
import { ErrorState } from "@/components/states";

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
  return <CreatePlaybookPageClient page={result.data} />;
}

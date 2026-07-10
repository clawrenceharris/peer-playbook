"use client";
import { ErrorState } from "@/components/states";

export default function ErrorPage() {
  return (
    <main className="gradient-background">
      <ErrorState
        variant="card"
        actionLabel="Refresh"
        onAction={() => window.location.reload()}
      />
    </main>
  );
}

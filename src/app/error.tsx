"use client";

import { ErrorState } from "@/components/states";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <main className="gradient-background">
      <ErrorState variant="card" retryLabel="Refresh" onRetry={router.refresh} />
    </main>
  );
}

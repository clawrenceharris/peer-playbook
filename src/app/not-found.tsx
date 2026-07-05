"use client";

import { ErrorState } from "@/components/states";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <ErrorState
      title="Page Not Found"
      message="The page you are looking for does not exist."
      className="bg-white"
      onAction={() => router.push("/")}
      actionLabel="Go Home"
    />
  );
}

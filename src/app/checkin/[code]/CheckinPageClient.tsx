"use client";

import { useSessionByCode } from "@/features/sessions/hooks/use-session-by-code";

type CheckinPageClientProps = {
  code: string;
};
export default function CheckinPageClient({ code }: CheckinPageClientProps) {
  const { data: session, isLoading, error } = useSessionByCode(code);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!session) {
    return <div>Session not found</div>;
  }
  return (
    <div>
      <h1>{session?.title}</h1>
      <p>{session?.description}</p>
      <p>{session?.scheduledStart}</p>
    </div>
  );
}

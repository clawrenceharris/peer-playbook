"use client";

import { Button } from "@/components/ui";
import { useSessionDetail } from "@/features/sessions/hooks/use-session";
import Link from "next/link";

type SessionPageClientProps = {
  id: string;
};
export default function SessionPageClient({ id }: SessionPageClientProps) {
  const { data: session } = useSessionDetail(id);
  console.log(session);

  if (!session) {
    return <div>Session not found</div>;
  }
  return (
    <div>
      <h1>{session?.title}</h1>
      <p>{session?.description}</p>
      <p>{session?.scheduledStart}</p>
      <Button variant="primary" asChild>
        <Link href={`/checkin/${session.sessionCode}`}>Go to check in</Link>
      </Button>
    </div>
  );
}

"use client";

import { PlaybookWorkspaceScreen } from "@/features/playbooks/presentation/components/playbook-page/playbook-workspace-screen";

interface PlaybookPageProps {
  playbookId: string;
  onBackClick?: () => void;
}
export default function PlaybookPage({
  playbookId,
  onBackClick,
}: PlaybookPageProps) {
  return (
    <PlaybookWorkspaceScreen
      playbookId={playbookId}
      onBackClick={onBackClick}
    />
  );
}

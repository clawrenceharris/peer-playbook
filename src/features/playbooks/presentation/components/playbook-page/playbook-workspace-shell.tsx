"use client";

import type { ReactNode } from "react";

type PlaybookWorkspaceShellProps = {
  phaseRail: ReactNode;
  strategySidebar: ReactNode;
  strategyEditor: ReactNode;
};

export function PlaybookWorkspaceShell({
  phaseRail,
  strategySidebar,
  strategyEditor,
}: PlaybookWorkspaceShellProps) {
  return (
    <div className="flex h-full flex-1 flex-col gap-3 pt-15">
      <div>{phaseRail}</div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        {strategySidebar}
        {strategyEditor}
      </div>
    </div>
  );
}

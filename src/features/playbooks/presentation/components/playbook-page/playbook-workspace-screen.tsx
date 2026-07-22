"use client";

import { Brain } from "lucide-react";
import { BeforeUnload } from "@/components/form";
import { StrategyPanel } from "@/components/shared";
import { ContentLayout } from "@/components/sidebar";
import { ErrorState } from "@/components/states";
import { AppSkeleton } from "@/components/ui";
import { StrategyDetails } from "./strategy-details";
import { StrategyListPanel } from "./strategy-list-panel";
import { PlaybookPhaseRail } from "./playbook-phase-rail";
import { PlaybookWorkspaceHeader } from "./playbook-workspace-header";
import { PlaybookWorkspaceShell } from "./playbook-workspace-shell";
import { formatMinutes, usePlaybookWorkspace } from "../../workspace";

type PlaybookWorkspaceScreenProps = {
  playbookId: string;
  onBackClick?: () => void;
};

export function PlaybookWorkspaceScreen({
  playbookId,
  onBackClick,
}: PlaybookWorkspaceScreenProps) {
  const workspace = usePlaybookWorkspace({ playbookId, onBackClick });

  if (workspace.isLoading) {
    return <AppSkeleton />;
  }

  if (workspace.error) {
    return <ErrorState variant="card" message={workspace.error.message} />;
  }

  if (!workspace.playbook || !workspace.activePhase) {
    return <ErrorState variant="card" message="Page not found" />;
  }

  return (
    <BeforeUnload disabled={workspace.beforeUnloadDisabled}>
      <ContentLayout
        showUserNav={false}
        headerClassName="min-h-30  border-none"
        canGoBack
        title={
          <PlaybookWorkspaceHeader
            playbook={workspace.playbook}
            metadata={workspace.metadata}
            hasSession={workspace.hasSession}
            isFavorite={workspace.isFavorite}
            isFavoriting={workspace.isFavoriting}
            isUnfavoriting={workspace.isUnfavoriting}
            canSaveWorkspace={workspace.isPhaseDirty && !workspace.isUpdating}
            isSavingWorkspace={workspace.state.isSavingWorkspace}
            onCreateSession={workspace.commands.createSession}
            onSaveWorkspace={workspace.commands.saveWorkspace}
            onToggleFavorite={workspace.commands.toggleFavorite}
            onDeletePlaybook={workspace.commands.confirmDeletePlaybook}
          />
        }

        secondaryHeaderClassName="bg-background p-3"
      >
        <PlaybookWorkspaceShell
          phaseRail={
            <PlaybookPhaseRail
              phases={workspace.phases}
              activePhaseId={workspace.activePhase.id}
              onSelectPhase={workspace.commands.selectPhase}
              onAddPhase={workspace.commands.addPlaybookPhase}
              onReorderPhases={workspace.commands.reorderPhases}
              onDeletePhase={() => {}}
              onPhaseIntentChange={workspace.commands.updatePhaseIntent}
              onTitleChange={workspace.commands.updatePhaseTitle}
              onEstimatedMinutesChange={
                workspace.commands.updatePhaseEstimatedMinutes
              }
            />
          }
          strategySidebar={
            <StrategyListPanel
              selectedStrategyId={workspace.activeStrategy?.id ?? null}
              phaseId={workspace.activePhase.id}
              onAddStrategyClick={() =>
                workspace.commands.setStrategyPanelOpen(true)
              }
              strategies={workspace.activeStrategies.map((strategy) => ({
                title:
                  strategy.id === workspace.activeStrategy?.id &&
                  workspace.state.strategyDraft
                    ? workspace.state.strategyDraft.title
                    : strategy.title,
                id: strategy.id,
                playbookPhaseId:
                  strategy.playbookPhaseId ?? workspace.activePhase!.id,
                duration: formatMinutes(
                  strategy.id === workspace.activeStrategy?.id &&
                    workspace.state.strategyDraft
                    ? workspace.state.strategyDraft.estimatedMinutes === ""
                      ? null
                      : Number(workspace.state.strategyDraft.estimatedMinutes)
                    : strategy.estimatedMinutes,
                ),
                phase: workspace.activePhase!.intent,
                Icon: workspace.activePhase!.Icon ?? Brain,
                steps: strategy.steps,
              }))}
              onReorder={(_phaseId, strategies) =>
                workspace.commands.reorderPhaseStrategies(strategies)
              }
              onStrategyClick={workspace.commands.selectStrategy}
              onRemoveStrategyClick={workspace.commands.removeStrategy}
            />
          }
          strategyEditor={
            <StrategyDetails
              strategy={workspace.activeStrategy}
              draft={workspace.state.strategyDraft}
              isDirty={workspace.isStrategyDirty}
              isSaving={workspace.state.isSavingStrategy}
              errorMessage={workspace.state.strategySaveError}
              onStepChange={workspace.commands.updateStrategyStep}
              onStepRemove={workspace.commands.removeStrategyStep}
              onAddStep={workspace.commands.addStrategyStep}
              onFacilitatorNotesChange={workspace.commands.updateStrategyNotes}
              onTitleChange={workspace.commands.updateStrategyTitle}
              onEstimatedMinutesChange={
                workspace.commands.updateStrategyEstimatedMinutes
              }
              onReset={workspace.commands.resetStrategyDraft}
              onSave={workspace.commands.saveStrategyDraft}
            />
          }
        />
        <StrategyPanel
          open={workspace.state.isStrategyPanelOpen}
          onOpenChange={workspace.commands.setStrategyPanelOpen}
          phaseTitle={workspace.activePhase.title}
          systemItems={workspace.systemStrategies.map(
            (strategy: { id: string; title: string }) => ({
              sourceType: "system",
              sourceId: strategy.id,
              title: strategy.title,
            }),
          )}
          savedItems={workspace.savedStrategies.map(
            (strategy: { id: string; title: string }) => ({
              sourceType: "system",
              sourceId: strategy.id,
              title: strategy.title,
            }),
          )}
          userItems={workspace.userStrategies.map(
            (strategy: { id: string; title: string }) => ({
              sourceType: "user",
              sourceId: strategy.id,
              title: strategy.title,
            }),
          )}
          disabledKeys={workspace.activeStrategies.flatMap((strategy) =>
            strategy.sourceType && strategy.sourceId
              ? [`${strategy.sourceType}:${strategy.sourceId}`]
              : [],
          )}
          onPick={workspace.commands.addStrategy}
        />
      </ContentLayout>
    </BeforeUnload>
  );
}

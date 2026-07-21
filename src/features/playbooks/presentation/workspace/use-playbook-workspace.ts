"use client";
import { useEffect, useMemo, useReducer } from "react";
import { useSidebar } from "@/components/ui";
import { useUser } from "@/components/providers";
import { useModals, usePendingMutations } from "@/hooks";
import {
  useAddFavoritePlaybook,
  useAddPlaybookPhase,
  useAddPlaybookStrategy,
  useDeletePlaybook,
  useMyFavoritePlaybooks,
  usePlaybookPage,
  useRemoveFavoritePlaybook,
  useRemovePlaybookStrategy,
  useReorderStrategies,
  useUpdatePlaybookPhases,
  useUpdatePlaybookStrategy,
} from "../hooks";
import { usePlaybookSessions } from "@/features/sessions/hooks";

import { createPlaybookWorkspaceCommands } from "./playbook-workspace.commands";
import {
  createInitialPlaybookWorkspaceState,
  playbookWorkspaceReducer,
} from "./playbook-workspace.reducer";
import {
  buildPlaybookWorkspaceModel,
  buildStrategyDraft,
  selectActivePhase,
  selectActiveStrategy,
  selectHasSession,
  selectHeaderMetadata,
  selectIsFavorite,
  selectStrategySourceMap,
  strategyDraftsEqual,
} from "./playbook-workspace.selectors";

type UsePlaybookWorkspaceArgs = {
  playbookId: string;
  onBackClick?: () => void;
};

export function usePlaybookWorkspace({
  playbookId,
  onBackClick,
}: UsePlaybookWorkspaceArgs) {
  const { data: page, error, isLoading } = usePlaybookPage({ playbookId });
  const playbook = page?.playbook;
  const { user } = useUser();
  const { setOpen: setSidebarOpen } = useSidebar();
  const [state, dispatch] = useReducer(
    playbookWorkspaceReducer,
    undefined,
    createInitialPlaybookWorkspaceState,
  );

  const { mutateAsync: addPlaybookStrategy } = useAddPlaybookStrategy();
  const { mutateAsync: addPlaybookPhase } = useAddPlaybookPhase();
  const { mutateAsync: reorderStrategies } = useReorderStrategies();
  const { mutateAsync: removePlaybookStrategy } = useRemovePlaybookStrategy();
  const { mutateAsync: updatePlaybookStrategy } = useUpdatePlaybookStrategy();
  const { mutateAsync: updatePlaybookPhases } = useUpdatePlaybookPhases();
  const { mutateAsync: favoritePlaybook, isPending: isFavoriting } =
    useAddFavoritePlaybook();
  const { mutateAsync: unfavoritePlaybook, isPending: isUnfavoriting } =
    useRemoveFavoritePlaybook();
  const { mutate: deletePlaybook } = useDeletePlaybook();
  const { pending: isUpdating } = usePendingMutations({
    mutationKey: ["update-playbook"],
  });

  const { data: systemStrategies = [] } = { data: [] };
  const { data: savedStrategies = [] } = { data: [] };
  const { data: userStrategies = [] } = { data: [] };
  const { data: sessions = [] } = usePlaybookSessions(playbook?.id ?? null);
  const { data: favoritePlaybooks = [] } = useMyFavoritePlaybooks(user.id);

  const {
    modals: {
      "session:create": createSessionModal,
      confirmation: confirmationModal,
    },
  } = useModals();

  const phases = useMemo(
    () =>
      buildPlaybookWorkspaceModel(page, state.phaseDrafts, state.phaseOrder),
    [page, state.phaseDrafts, state.phaseOrder],
  );
  const activePhase = useMemo(
    () => selectActivePhase(phases, state.selectedPhaseId),
    [phases, state.selectedPhaseId],
  );
  const activeStrategies = useMemo(
    () => activePhase?.strategies ?? [],
    [activePhase],
  );
  const activeStrategy = useMemo(
    () => selectActiveStrategy(activePhase, state.selectedStrategyId),
    [activePhase, state.selectedStrategyId],
  );
  const metadata = useMemo(() => selectHeaderMetadata(playbook), [playbook]);
  const strategySourceByKey = useMemo(
    () =>
      selectStrategySourceMap(
        systemStrategies,
        savedStrategies,
        userStrategies,
      ),
    [savedStrategies, systemStrategies, userStrategies],
  );
  const hasSession = useMemo(
    () => selectHasSession(playbook?.id, sessions),
    [playbook?.id, sessions],
  );
  const favorite = useMemo(
    () => selectIsFavorite(playbook?.id, favoritePlaybooks),
    [favoritePlaybooks, playbook?.id],
  );
  // Phase reorder is local until Save, so treat phaseOrder as dirty too.
  const isPhaseDirty =
    Object.keys(state.phaseDrafts).length > 0 || state.phaseOrder !== null;
  const isStrategyDirty = !strategyDraftsEqual(
    state.strategyDraft,
    state.strategyBaseline,
  );

  useEffect(() => {
    if (!onBackClick) {
      setSidebarOpen(false);
    }
  }, [onBackClick, setSidebarOpen]);

  useEffect(() => {
    dispatch({ type: "syncFavorite", value: favorite });
  }, [favorite]);

  useEffect(() => {
    if (phases.length === 0) return;

    const selectedPhaseExists = phases.some(
      (phase) => phase.id === state.selectedPhaseId,
    );

    if (!state.selectedPhaseId || !selectedPhaseExists) {
      dispatch({ type: "selectPhase", phaseId: phases[0].id });
    }
  }, [phases, state.selectedPhaseId]);

  useEffect(() => {
    if (activeStrategies.length === 0) {
      if (state.selectedStrategyId !== null) {
        dispatch({ type: "selectStrategy", strategyId: null });
      }
      return;
    }

    const selectedStrategyExists = activeStrategies.some(
      (strategy) => strategy.id === state.selectedStrategyId,
    );

    if (!state.selectedStrategyId || !selectedStrategyExists) {
      dispatch({ type: "selectStrategy", strategyId: activeStrategies[0].id });
    }
  }, [activeStrategies, state.selectedStrategyId]);

  useEffect(() => {
    if (!activeStrategy) {
      dispatch({ type: "clearStrategyDraft" });
      return;
    }

    dispatch({
      type: "setStrategyDraftSnapshot",
      draft: buildStrategyDraft(activeStrategy),
    });
  }, [activeStrategy]);

  const commands = createPlaybookWorkspaceCommands({
    playbook,
    userId: user.id,
    state,
    dispatch,
    phases,
    activePhase,
    activeStrategyId: activeStrategy?.id ?? null,
    activeStrategies,
    strategySourceByKey,
    addPlaybookStrategy,
    reorderStrategies,
    addPlaybookPhase,
    removePlaybookStrategy,
    updatePlaybookStrategy,
    updatePlaybookPhases,
    favoritePlaybook,
    unfavoritePlaybook,
    deletePlaybook,
    openCreateSession: (nextPlaybook) =>
      createSessionModal.open({
        playbook: {
          ...nextPlaybook,
          createdBy: nextPlaybook.creator.id,
        },
      }),
    openDeleteConfirmation: confirmationModal.open,
  });

  return {
    page,
    playbook,
    error,
    isLoading,
    metadata,
    phases,
    activePhase,
    activeStrategies,
    activeStrategy,
    systemStrategies,
    savedStrategies,
    userStrategies,
    state,
    commands,
    hasSession,
    isFavorite: state.isFavorite,
    isFavoriting,
    isUnfavoriting,
    isUpdating,
    isPhaseDirty,
    isStrategyDirty,
    beforeUnloadDisabled: !isPhaseDirty && !isStrategyDirty,
  };
}

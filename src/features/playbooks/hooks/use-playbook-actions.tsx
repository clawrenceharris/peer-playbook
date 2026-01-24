import { PlaybookStrategy } from "@/features/playbooks/domain";
import { Strategy } from "@/features/strategies/domain";
import { useCallback, useEffect } from "react";
import { useModal } from "@/app/providers";
import { PLAYBOOK_MODAL_TYPES } from "../components/modals";
import {
  useDeletePlaybook,
  useGeneratePlaybook,
  useUpdatePlaybook,
  useUpdatePlaybookStrategy,
} from ".";
import {
  DeletePlaybookModalProps,
  UpdatePlaybookModalProps,
  ReplaceStrategyModalProps,
} from "@/lib/modals/types";

export const usePlaybookActions = () => {
  const { isPending: isDeleting, mutateAsync: handleDeletePlaybook } =
    useDeletePlaybook();
  const { isPending: isUpdating, mutateAsync: updatePlaybookStrategy } =
    useUpdatePlaybookStrategy();
  const { mutateAsync: handleGeneratePlaybook, isPending: isGenerating } =
    useGeneratePlaybook();
  const { mutateAsync: handleUpdatePlaybook } = useUpdatePlaybook();
  const { openModal } = useModal();


  const handleReplaceStrategy = useCallback(
    async (
      playbookId: string,
      strategyToReplace: PlaybookStrategy,
      newStrategy: Strategy
    ) => {
      const { steps, id, title, description } = newStrategy;

      await updatePlaybookStrategy({
        strategyId: strategyToReplace.id,
        playbookId,
        data: {
          playbookId,
          steps,
          baseStrategyId: id,
          title,
          description,
        },
      });
    },
    [updatePlaybookStrategy]
  );
  const replaceStrategy = useCallback(
    (playbookId: string, strategy: PlaybookStrategy) => {
      openModal<ReplaceStrategyModalProps>(
        PLAYBOOK_MODAL_TYPES.REPLACE_STRATEGY,
        {
          strategyToReplace: strategy,
          playbookId,
          onConfirm: (strategyToReplace, newStrategy) =>
            handleReplaceStrategy(playbookId, strategyToReplace, newStrategy),
          isLoading: isUpdating,
        }
      );
    },
    [handleReplaceStrategy, isUpdating, openModal]
  );

  const updatePlaybook = useCallback(
    (playbookId: string) => {
      openModal<UpdatePlaybookModalProps>(PLAYBOOK_MODAL_TYPES.UPDATE, {
        playbookId,
        onConfirm: (data) => handleUpdatePlaybook({ playbookId, data }),
      });
    },
    [handleUpdatePlaybook, openModal]
  );

  const deletePlaybook = useCallback(
    (playbookId: string) => {
      openModal<DeletePlaybookModalProps>(PLAYBOOK_MODAL_TYPES.DELETE, {
        playbookId,
        onConfirm: () => handleDeletePlaybook(playbookId),

        isLoading: isDeleting,
      });
    },
    [handleDeletePlaybook, isDeleting, openModal]
  );

  return {
    updatePlaybook,
    replaceStrategy,
    deletePlaybook,
  };
};

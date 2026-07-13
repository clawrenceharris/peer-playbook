import { PlaybookStrategy } from "@/features/playbooks/domain";
import { Strategy } from "@/features/strategies/domain";
import { useCallback } from "react";
import { useModal } from "@/components/providers";
import { PLAYBOOK_MODAL_TYPES } from "../components/modals";
import {
  useDeletePlaybook,
  useUpdatePlaybook,
  useUpdatePlaybookStrategy,
} from ".";
import {
  UpdatePlaybookModalProps,
  ReplaceStrategyModalProps,
  ConfirmationModalProps,
} from "@/lib/modals/types";
/**
 * @deprecated
 */
export const usePlaybookActions = () => {
  const { isPending: isDeleting, mutateAsync: handleDeletePlaybook } =
    useDeletePlaybook();
  const { isPending: isUpdating, mutateAsync: updatePlaybookStrategy } =
    useUpdatePlaybookStrategy();

  const { mutateAsync: handleUpdatePlaybook } = useUpdatePlaybook();
  const { openModal } = useModal();

  const handleReplaceStrategy = useCallback(
    async (
      playbookId: string,
      strategyToReplace: PlaybookStrategy,
      newStrategy: Strategy,
    ) => {
      const { steps, id, title, description, slug, category } = newStrategy;

      await updatePlaybookStrategy({
        strategyId: strategyToReplace.id,
        playbookId,
        data: {
          title,
          steps,
          cardSlug:
            slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          category: category ?? "strategy",
          sourceId: id,
          sourceType: "system",
          description: description ?? "",
        },
      });
    },
    [updatePlaybookStrategy],
  );
  const replaceStrategy = useCallback(
    (playbookId: string, strategy: PlaybookStrategy) => {
      openModal<ReplaceStrategyModalProps>(
        PLAYBOOK_MODAL_TYPES.REPLACE_STRATEGY,
        {
          strategyToReplace: strategy,
          playbookId,
          onSubmit: (strategyToReplace, newStrategy) =>
            handleReplaceStrategy(playbookId, strategyToReplace, newStrategy),
          isLoading: isUpdating,
        },
      );
    },
    [handleReplaceStrategy, isUpdating, openModal],
  );

  const updatePlaybook = useCallback(
    (playbookId: string) => {
      openModal<UpdatePlaybookModalProps>(PLAYBOOK_MODAL_TYPES.UPDATE, {
        playbookId,
        onSubmit: (data) => handleUpdatePlaybook({ playbookId, data }),
      });
    },
    [handleUpdatePlaybook, openModal],
  );

  const deletePlaybook = useCallback(
    (playbookId: string) => {
      openModal<ConfirmationModalProps>("confirmation", {
        title: "Delete Playbook",
        description: "Are you sure you want to delete this playbook?",
        onConfirm: () => handleDeletePlaybook(playbookId),
        isAlert: true,
        isLoading: isDeleting,
      });
    },
    [handleDeletePlaybook, isDeleting, openModal],
  );

  return {
    updatePlaybook,
    replaceStrategy,
    deletePlaybook,
  };
};

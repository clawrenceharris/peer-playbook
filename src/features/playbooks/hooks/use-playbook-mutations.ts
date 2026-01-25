import { DefaultError, useQueryClient } from "@tanstack/react-query";
import {
  CreatePlaybookFormValues,
  GeneratePlaybookFormValues,
  Playbook,
  PlaybookStrategy,
  PlaybookStrategyUpdate,
  PlaybookUpdate,
  PlaybookService,
  playbookKeys,
} from "../domain";
import {
  createMultiQueryOptimisticUpdate,
  useDomainMutation,
} from "@/lib/queries";
import { usePlaybookService } from ".";
import { useUser } from "@/app/providers";

export const useDeletePlaybook = () => {
  return useDomainMutation<PlaybookService, void, DefaultError, string>(
    usePlaybookService,
    {
      queryKey: playbookKeys.all,
      mutationKey: ["delete-playbook"],
      mutationFn: (playbookService, id) => playbookService.delete(id),
    },
  );
};

export const useUpdatePlaybook = () => {
  return useDomainMutation<
    PlaybookService,
    Playbook,
    DefaultError,
    { playbookId: string; data: PlaybookUpdate }
  >(usePlaybookService, {
    mutationKey: ["update-playbook"],
    mutationFn: (playbookService, { playbookId, data }) =>
      playbookService.update(playbookId, data),

    updater: (playbooks, { playbookId }) => {
      return playbooks.filter((p: Playbook) => p.id !== playbookId);
    },
    invalidateFn: () => playbookKeys.all,
  });
};

export const useToggleFavoritePlaybook = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { onMutate, onError } = createMultiQueryOptimisticUpdate<
    { playbookId: string; favorite: boolean },
    Record<string, Playbook | Playbook[] | undefined>
  >(queryClient, {
    cancelKey: playbookKeys.all,
    queries: [
      {
        getKey: ({ playbookId }) => playbookKeys.detail(playbookId),
        updater: (old, { favorite }) => ({ ...old, favorite }),
      },
      {
        getKey: () => playbookKeys.byUser(user.id),
        updater: (old, { playbookId, favorite }) =>
          Array.isArray(old)
            ? old.map((p) => (p.id === playbookId ? { ...p, favorite } : p))
            : old,
      },
      {
        getKey: () => playbookKeys.lists(),
        updater: (old, { playbookId, favorite }) =>
          Array.isArray(old)
            ? old.map((p) => (p.id === playbookId ? { ...p, favorite } : p))
            : old,
      },
    ],
  });

  return useDomainMutation<
    PlaybookService,
    Playbook,
    DefaultError,
    { playbookId: string; favorite: boolean }
  >(usePlaybookService, {
    queryKey: playbookKeys.all,
    mutationKey: ["update-playbook", "toggle-favorite-playbook"],
    mutationFn: (playbookService, { playbookId, favorite }) =>
      playbookService.update(playbookId, { favorite }),
    invalidateFn: () => [playbookKeys.all],
    onMutate,
    onError,
  });
};

export const useGeneratePlaybook = () => {
  return useDomainMutation<
    PlaybookService,
    Playbook,
    DefaultError,
    GeneratePlaybookFormValues
  >(usePlaybookService, {
    queryKey: playbookKeys.all,
    mutationKey: ["generate-playbook"],
    mutationFn: (playbookService, data) =>
      playbookService.generatePlaybook(data),
    invalidateFn: () => playbookKeys.all,
  });
};

export const useCreatePlaybook = () => {
  return useDomainMutation<
    PlaybookService,
    Playbook,
    DefaultError,
    CreatePlaybookFormValues
  >(usePlaybookService, {
    queryKey: playbookKeys.all,
    mutationKey: ["create-playbook"],
    mutationFn: (playbookService, data) =>
      playbookService.createManualPlaybook(data),
    invalidateFn: () => playbookKeys.all,
  });
};

export const useUpdatePlaybookStrategy = () => {
  return useDomainMutation<
    PlaybookService,
    PlaybookStrategy,
    DefaultError,
    { playbookId: string; strategyId: string; data: PlaybookStrategyUpdate }
  >(usePlaybookService, {
    mutationKey: ["update-playbook-strategy"],
    mutationFn: (playbookService, { strategyId, data }) =>
      playbookService.updatePlaybookStrategy(strategyId, data),
    invalidateFn: () => playbookKeys.all,
  });
};
/**
 * Change the position of strategies
 * within the playbook (warmup/workout/closer)
 */
export const useReorderStrategies = () => {
  return useDomainMutation<
    PlaybookService,
    void,
    DefaultError,
    { playbookId: string; strategies: PlaybookStrategy[] }
  >(usePlaybookService, {
    mutationKey: ["reorder-strategies"],
    mutationFn: (playbookService, { strategies }) =>
      playbookService.reorderStrategies(strategies),
    invalidateFn: (_, { playbookId }) => playbookKeys.detail(playbookId),
  });
};

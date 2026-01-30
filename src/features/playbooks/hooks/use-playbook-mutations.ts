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
      mutationFn: (playbookService, id) => playbookService.deletePlaybook(id),
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

export const useAddFavoritePlaybook = () => {
  return useDomainMutation<
    PlaybookService,
    void,
    DefaultError,
    { playbookId: string; userId: string }
  >(usePlaybookService, {
    queryKey: playbookKeys.favorite(),
    mutationKey: ["add-favorite-playbook"],
    mutationFn: (playbookService, { playbookId, userId }) =>
      playbookService.addFavoritePlaybook(playbookId, userId),
    invalidateFn: () => playbookKeys.all,
  });
};
export const useRemoveFavoritePlaybook = () => {
  return useDomainMutation<
    PlaybookService,
    void,
    DefaultError,
    { playbookId: string; userId: string }
  >(usePlaybookService, {
    queryKey: playbookKeys.favorite(),
    mutationKey: ["remove-favorite-playbook"],
    mutationFn: (playbookService, { playbookId, userId }) =>
      playbookService.removeFavoritePlaybook(playbookId, userId),
    invalidateFn: () => playbookKeys.all,
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

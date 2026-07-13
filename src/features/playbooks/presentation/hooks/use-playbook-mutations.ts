import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import {
  addPlaybookStrategyAction,
  addFavoritePlaybookAction,
  createPlaybookAction,
  deletePlaybookAction,
  generatePlaybookAction,
  removeFavoritePlaybookAction,
  removePlaybookStrategyAction,
  updatePlaybookAction,
  updatePlaybookStrategyAction,
} from "@/actions/playbook";
import {
  BuildPlaybookFormValues,
  GeneratePlaybookFormValues,
  UpdatePlaybookFormValues,
} from "@/lib/validation";
import { playbookKeys } from "@/lib/queries/keys";
import { useUser } from "@/components/providers";
import { PlaybookStrategyCardDTO } from "../../application/dto";
import { PlaybookStrategyUpdate } from "../../domain";
import { ActionResult } from "@/shared/action";

function unwrapActionResult<T>(result: ActionResult<T>): T {
  if (!result.success) {
    throw result.error;
  }

  return result.data;
}

export const useDeletePlaybook = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  return useMutation({
    mutationKey: ["delete-playbook"],
    mutationFn: async (id: string) => {
      const result = await deletePlaybookAction({ id });
      unwrapActionResult(result);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: playbookKeys.all });
      queryClient.removeQueries({ queryKey: playbookKeys.detail(id) });
      if (pathname === `/playbooks/${id}`) {
        router.push("/my-library/playbooks");
      }
    },
  });
};

export const useUpdatePlaybook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-playbook"],
    mutationFn: async ({
      playbookId,
      data,
    }: {
      playbookId: string;
      data: UpdatePlaybookFormValues;
    }) => {
      const result = await updatePlaybookAction({
        id: playbookId,
        ...(data.title !== undefined && { title: data.title }),
        ...(data.subject !== undefined && { subject: data.subject }),
        ...(data.topic !== undefined && { topic: data.topic }),
        ...(data.courseName != null && { courseName: data.courseName }),
      });
      return unwrapActionResult(result);
    },
    onSuccess: (_, { playbookId }) => {
      queryClient.invalidateQueries({ queryKey: playbookKeys.all });
      queryClient.invalidateQueries({
        queryKey: playbookKeys.detail(playbookId),
      });
    },
  });
};

export const useAddFavoritePlaybook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-favorite-playbook"],
    mutationFn: async ({
      playbookId,
      userId,
    }: {
      playbookId: string;
      userId: string;
    }) => {
      const result = await addFavoritePlaybookAction({ playbookId, userId });
      return unwrapActionResult(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playbookKeys.all });
      queryClient.invalidateQueries({ queryKey: playbookKeys.favorite() });
    },
  });
};

export const useRemoveFavoritePlaybook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-favorite-playbook"],
    mutationFn: async ({
      playbookId,
      userId,
    }: {
      playbookId: string;
      userId: string;
    }) => {
      const result = await removeFavoritePlaybookAction({ playbookId, userId });
      return unwrapActionResult(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playbookKeys.all });
      queryClient.invalidateQueries({ queryKey: playbookKeys.favorite() });
    },
  });
};

export const useGeneratePlaybook = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationKey: ["generate-playbook"],
    mutationFn: async (data: GeneratePlaybookFormValues) => {
      const result = await generatePlaybookAction({ ...data, userId: user.id });
      return unwrapActionResult(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playbookKeys.all });
    },
  });
};

export const useCreatePlaybook = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationKey: ["create-playbook"],
    mutationFn: async (data: BuildPlaybookFormValues) => {
      const result = await createPlaybookAction({ ...data, userId: user.id });
      return unwrapActionResult(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playbookKeys.all });
    },
  });
};

export const useUpdatePlaybookStrategy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-playbook-strategy"],
    mutationFn: async ({
      playbookId,
      strategyId,
      data,
    }: {
      playbookId: string;
      strategyId: string;
      data: PlaybookStrategyUpdate;
    }) => {
      const phase =
        data.phase === "warmup" ||
        data.phase === "workout" ||
        data.phase === "closer"
          ? data.phase
          : undefined;
      const result = await updatePlaybookStrategyAction({
        playbookId,
        strategyId,
        ...(data.steps !== undefined && { steps: data.steps }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.cardSlug !== undefined && { cardSlug: data.cardSlug }),
        ...(data.category !== undefined && { category: data.category }),
        ...(phase !== undefined && { phase }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.sourceId != null && { sourceId: data.sourceId }),
        ...(data.sourceType != null && { sourceType: data.sourceType }),
      });
      return unwrapActionResult(result);
    },
    onSuccess: (_, { playbookId }) => {
      queryClient.invalidateQueries({ queryKey: playbookKeys.all });
      queryClient.invalidateQueries({
        queryKey: playbookKeys.detail(playbookId),
      });
    },
  });
};

export const useAddPlaybookStrategy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-playbook-strategy"],
    mutationFn: async (input: Parameters<typeof addPlaybookStrategyAction>[0]) => {
      const result = await addPlaybookStrategyAction(input);
      return unwrapActionResult(result);
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: playbookKeys.all });
      queryClient.invalidateQueries({
        queryKey: playbookKeys.detail(input.playbookId),
      });
      queryClient.invalidateQueries({
        queryKey: playbookKeys.page(input.playbookId),
      });
    },
  });
};

export const useRemovePlaybookStrategy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-playbook-strategy"],
    mutationFn: async (input: Parameters<typeof removePlaybookStrategyAction>[0]) => {
      const result = await removePlaybookStrategyAction(input);
      return unwrapActionResult(result);
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: playbookKeys.all });
      queryClient.invalidateQueries({
        queryKey: playbookKeys.detail(input.playbookId),
      });
      queryClient.invalidateQueries({
        queryKey: playbookKeys.page(input.playbookId),
      });
    },
  });
};

/**
 * Change the position of strategies within a playbook phase.
 */
export const useReorderStrategies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["reorder-strategies"],
    mutationFn: async ({
      playbookId,
      phaseId,
      strategies,
    }: {
      playbookId: string;
      phaseId: string;
      strategies: Array<{
        id: string;
        title: string;
        phase: PlaybookStrategyCardDTO["phase"];
        playbookPhaseId?: string | null;
      }>;
    }) => {
      if (
        strategies.some(
          (strategy) =>
            strategy.playbookPhaseId !== undefined &&
            strategy.playbookPhaseId !== phaseId,
        )
      ) {
        throw new Error("Strategies must belong to the same phase");
      }
      await Promise.all(
        strategies.map(async (strategy, index) => {
          const phase =
            strategy.phase === "warmup" ||
            strategy.phase === "workout" ||
            strategy.phase === "closer"
              ? strategy.phase
              : undefined;
          const result = await updatePlaybookStrategyAction({
            strategyId: strategy.id,
            playbookId,
            title: strategy.title,
            position: index,
            ...(phase !== undefined && { phase }),
          });
          unwrapActionResult(result);
        }),
      );
    },
    onSuccess: (_, { playbookId }) => {
      queryClient.invalidateQueries({
        queryKey: playbookKeys.detail(playbookId),
      });
      queryClient.invalidateQueries({
        queryKey: playbookKeys.page(playbookId),
      });
    },
  });
};

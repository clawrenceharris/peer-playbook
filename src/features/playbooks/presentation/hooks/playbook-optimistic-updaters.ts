import type { QueryClient } from "@tanstack/react-query";
import { playbookKeys } from "@/lib/queries/keys";
import type {
  AddPlaybookStrategyInput,
  GetPlaybookPageOutput,
  PlaybookDetailDTO,
  AddPlaybookPhaseInput,
  PlaybookPhaseDTO,
} from "../../application/dto";
import {
  insertPhaseList,
  insertStrategyList,
  removeStrategyList,
  reorderStrategyList,
  replaceById,
  type ReorderMutationStrategy,
} from "./playbook-cache-updaters";
import { toPhaseIntentKey } from "../workspace";
import { PHASE_INTENT_LABELS } from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";

export type PlaybookStrategyCacheSnapshot = {
  previousPage: GetPlaybookPageOutput | undefined;
  previousPlaybook: PlaybookDetailDTO | undefined;
  previousPlaybookDetail: PlaybookDetailDTO | undefined;
};

export async function snapshotPlaybookCaches(
  queryClient: QueryClient,
  playbookId: string,
): Promise<PlaybookStrategyCacheSnapshot> {
  const pageKey = playbookKeys.page(playbookId);
  const playbookKey = playbookKeys.detail(playbookId);
  const playbookDetailKey = playbookKeys.detail(playbookId, "detail");

  await Promise.all([
    queryClient.cancelQueries({ queryKey: pageKey }),
    queryClient.cancelQueries({ queryKey: playbookKey }),
    queryClient.cancelQueries({ queryKey: playbookDetailKey }),
  ]);

  return {
    previousPage: queryClient.getQueryData<GetPlaybookPageOutput>(pageKey),
    previousPlaybook: queryClient.getQueryData<PlaybookDetailDTO>(playbookKey),
    previousPlaybookDetail:
      queryClient.getQueryData<PlaybookDetailDTO>(playbookDetailKey),
  };
}

export function restorePlaybookStrategyCaches(
  queryClient: QueryClient,
  playbookId: string,
  snapshot: PlaybookStrategyCacheSnapshot,
) {
  queryClient.setQueryData(
    playbookKeys.page(playbookId),
    snapshot.previousPage,
  );
  queryClient.setQueryData(
    playbookKeys.detail(playbookId),
    snapshot.previousPlaybook,
  );
  queryClient.setQueryData(
    playbookKeys.detail(playbookId, "detail"),
    snapshot.previousPlaybookDetail,
  );
}

export function invalidatePlaybookCaches(
  queryClient: QueryClient,
  playbookId: string,
) {
  queryClient.invalidateQueries({ queryKey: playbookKeys.all });

  queryClient.invalidateQueries({
    queryKey: playbookKeys.page(playbookId),
  });
}

export function applyOptimisticReorderStrategyCaches(
  queryClient: QueryClient,
  playbookId: string,
  strategies: ReorderMutationStrategy[],
) {
  queryClient.setQueryData<GetPlaybookPageOutput>(
    playbookKeys.page(playbookId),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        strategies: reorderStrategyList(current.strategies, strategies),
      };
    },
  );

  queryClient.setQueryData<PlaybookDetailDTO>(
    playbookKeys.detail(playbookId),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        strategies: reorderStrategyList(current.strategies, strategies),
      };
    },
  );

  queryClient.setQueryData<PlaybookDetailDTO>(
    playbookKeys.detail(playbookId, "detail"),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        strategies: reorderStrategyList(current.strategies, strategies),
      };
    },
  );
}
export function applyOptimisticAddPlaybookPhaseCaches(
  queryClient: QueryClient,
  input: AddPlaybookPhaseInput,
): string {
  const tempId = `temp-phase-${crypto.randomUUID()}`;
  const intentKey = toPhaseIntentKey(input.intent);
  const intentLabel =
    typeof PHASE_INTENT_LABELS[input.intent] === "string"
      ? (PHASE_INTENT_LABELS[input.intent] as string)
      : input.title;

  // Page cache stores phases under playbook.phases (not top-level).
  const optimisticPagePhase = {
    id: tempId,
    title: input.title,
    position: input.position,
    intent: {
      id: tempId,
      key: intentKey,
      title: intentLabel,
      sortOrder: input.position,
    },
    estimatedMinutes: input.estimatedMinutes,
    objective: input.objective,
  };

  queryClient.setQueryData<GetPlaybookPageOutput>(
    playbookKeys.page(input.playbookId),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        playbook: {
          ...current.playbook,
          phases: insertPhaseList(current.playbook.phases, optimisticPagePhase),
        },
      };
    },
  );

  return tempId;
}
export function applyOptimisticAddStrategyCaches(
  queryClient: QueryClient,
  input: AddPlaybookStrategyInput,
) {
  const tempId = `temp-strategy-${crypto.randomUUID()}`;
  const createdAt = new Date();

  const optimisticPageStrategy = {
    id: tempId,
    slug: input.slug,
    title: input.title,
    phase: input.phase,
    playbookPhaseId: input.playbookPhaseId,
    category: input.category,
    sourceId: input.sourceId,
    sourceType: input.sourceType,
    position: input.position,
    steps: input.steps,
    facilitatorNotes: input.facilitatorNotes ?? null,
    estimatedMinutes: input.estimatedMinutes ?? null,
    resources: [],
    createdAt,
    updatedAt: null,
  };

  queryClient.setQueryData<GetPlaybookPageOutput>(
    playbookKeys.page(input.playbookId),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        strategies: insertStrategyList(
          current.strategies,
          optimisticPageStrategy,
        ),
      };
    },
  );

  return tempId;
}
export function replaceOptimisticAddedPhase(
  queryClient: QueryClient,
  playbookId: string,
  tempId: string,
  result: PlaybookPhaseDTO,
) {
  queryClient.setQueryData<GetPlaybookPageOutput>(
    playbookKeys.page(playbookId),
    (current) => {
      if (!current) return current;
      const optimisticPhase = current.playbook.phases.find(
        (item) => item.id === tempId,
      );

      if (!optimisticPhase) {
        return current;
      }

      return {
        ...current,
        playbook: {
          ...current.playbook,
          phases: replaceById(current.playbook.phases, tempId, {
            id: result.id,
            title: result.title,
            position: result.position,
            intent: {
              id: result.intent.id,
              key: result.intent.key,
              title: result.intent.title,
              sortOrder: result.intent.sortOrder,
            },
            estimatedMinutes: result.estimatedMinutes,
            objective: result.objective,
          }),
        },
      };
    },
  );
}
export function replaceOptimisticAddedStrategy(
  queryClient: QueryClient,
  playbookId: string,
  tempId: string,
  result: PlaybookDetailDTO["strategies"][number],
) {
  queryClient.setQueryData<GetPlaybookPageOutput>(
    playbookKeys.page(playbookId),
    (current) => {
      if (!current) return current;
      const optimisticStrategy = current.strategies.find(
        (item) => item.id === tempId,
      );

      if (!optimisticStrategy) {
        return current;
      }

      return {
        ...current,
        strategies: replaceById(current.strategies, tempId, {
          ...optimisticStrategy,
          ...result,
          playbookPhaseId:
            result.playbookPhaseId ??
            optimisticStrategy.playbookPhaseId ??
            null,
          steps: optimisticStrategy.steps,
          facilitatorNotes: optimisticStrategy.facilitatorNotes ?? null,
          estimatedMinutes: optimisticStrategy.estimatedMinutes ?? null,
          resources: optimisticStrategy.resources ?? [],
          createdAt: optimisticStrategy.createdAt,
          updatedAt: null,
        }),
      };
    },
  );
}

export function applyOptimisticRemoveStrategyCaches(
  queryClient: QueryClient,
  playbookId: string,
  strategyId: string,
) {
  queryClient.setQueryData<GetPlaybookPageOutput>(
    playbookKeys.page(playbookId),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        strategies: removeStrategyList(current.strategies, strategyId),
      };
    },
  );
}

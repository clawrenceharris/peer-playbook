import type { PlaybookStrategyCardDTO } from "../../application/dto";

export type ReorderMutationStrategy = {
  id: string;
  title: string;
  phase: PlaybookStrategyCardDTO["phase"];
  playbookPhaseId?: string | null;
};

export type StrategyCacheShape = {
  id: string;
  phase: string;
  position?: number;
  playbookPhaseId?: string | null;
};

/**
 * Newer data can scope ordering by `playbookPhaseId`. Older rows may still lack
 * that foreign key, so reordering falls back to the legacy phase string.
 */
function isSamePhase<TStrategy extends StrategyCacheShape>(
  left: TStrategy,
  right: TStrategy,
): boolean {
  if (
    left.playbookPhaseId !== undefined &&
    right.playbookPhaseId !== undefined
  ) {
    return left.playbookPhaseId === right.playbookPhaseId;
  }

  return left.phase === right.phase;
}

export function reorderStrategyList<TStrategy extends StrategyCacheShape>(
  current: TStrategy[],
  strategies: ReorderMutationStrategy[],
): TStrategy[] {
  const currentById = new Map(
    current.map((strategy) => [strategy.id, strategy]),
  );
  const reorderedStrategies = strategies.reduce<TStrategy[]>(
    (acc, strategy, index) => {
      const currentStrategy = currentById.get(strategy.id);
      if (!currentStrategy) return acc;

      acc.push({
        ...currentStrategy,
        phase: strategy.phase,
        playbookPhaseId:
          strategy.playbookPhaseId ?? currentStrategy.playbookPhaseId,
        position: index,
      });
      return acc;
    },
    [],
  );
  const reorderedIds = new Set(strategies.map((strategy) => strategy.id));

  let reorderedIndex = 0;

  // Preserve untouched strategies exactly where they were; only the provided
  // phase-local subset receives new positions.
  return current.map((strategy) => {
    if (!reorderedIds.has(strategy.id)) {
      return strategy;
    }

    const nextStrategy = reorderedStrategies[reorderedIndex];
    reorderedIndex += 1;
    return nextStrategy ?? strategy;
  });
}
export function insertPhaseList<
  TPhase extends { id: string; position?: number },
>(current: TPhase[], phase: TPhase): TPhase[] {
  const next = [...current];
  const insertAt = Math.max(
    0,
    Math.min(phase.position ?? next.length, next.length),
  );
  next.splice(insertAt, 0, phase);

  return next.map((item, index) => ({
    ...item,
    position: index,
  }));
}

export function reorderPhaseList<
  TPhase extends { id: string; position?: number },
>(current: TPhase[], phaseIds: string[]): TPhase[] {
  const byId = new Map(current.map((phase) => [phase.id, phase]));
  const ordered = phaseIds
    .map((id) => byId.get(id))
    .filter((phase): phase is TPhase => Boolean(phase))
    .map((phase, index) => ({
      ...phase,
      position: index,
    }));

  const seen = new Set(phaseIds);
  for (const phase of current) {
    if (seen.has(phase.id)) continue;
    ordered.push({
      ...phase,
      position: ordered.length,
    });
  }

  return ordered;
}
export function insertStrategyList<TStrategy extends StrategyCacheShape>(
  current: TStrategy[],
  strategy: TStrategy,
): TStrategy[] {
  const next = [...current];
  const insertAt = Math.max(
    0,
    Math.min(strategy.position ?? next.length, next.length),
  );
  next.splice(insertAt, 0, strategy);

  let phaseIndex = 0;

  return next.map((item) => {
    if (!isSamePhase(item, strategy)) {
      return item;
    }

    const nextPosition = phaseIndex;
    phaseIndex += 1;
    return {
      ...item,
      position: nextPosition,
    };
  });
}

export function removeStrategyList<TStrategy extends StrategyCacheShape>(
  current: TStrategy[],
  strategyId: string,
): TStrategy[] {
  const removedStrategy = current.find((item) => item.id === strategyId);
  if (!removedStrategy) {
    return current;
  }

  let phaseIndex = 0;

  return current
    .filter((item) => item.id !== strategyId)
    .map((item) => {
      if (!isSamePhase(item, removedStrategy)) {
        return item;
      }

      const nextPosition = phaseIndex;
      phaseIndex += 1;
      return {
        ...item,
        position: nextPosition,
      };
    });
}

export function replaceById<T extends { id: string }>(
  current: T[],
  strategyId: string,
  replacement: T,
): T[] {
  return current.map((item) => (item.id === strategyId ? replacement : item));
}

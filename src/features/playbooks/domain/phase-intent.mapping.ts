import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

/**
 * Maps workspace PhaseIntent values to the persisted intent key used by
 * playbook_phases / phase_intents. Unknown values fall back to `apply` so
 * older UI callers do not write an invalid intent key during the migration.
 * Transition is not a creatable phase intent yet.
 */
export function toPhaseIntentKey(
  intent: PhaseIntent | string,
): "activate" | "explore" | "apply" | "reflect" {
  if (
    intent === PhaseIntent.ACTIVATE ||
    intent === PhaseIntent.EXPLORE ||
    intent === PhaseIntent.APPLY ||
    intent === PhaseIntent.REFLECT
  ) {
    return intent;
  }

  return PhaseIntent.APPLY;
}

/**
 * Legacy lesson_phase values still stored on playbook_strategies.phase.
 * Kept for backward compatibility with older strategy rows. Unknown values
 * intentionally collapse to `workout`, which is the closest legacy bucket to
 * the newer `apply` intent.
 */
export function toLegacyPhase(
  intent: PhaseIntent | string,
): "warmup" | "workout" | "closer" {
  if (intent === PhaseIntent.ACTIVATE) return "warmup";
  if (intent === PhaseIntent.EXPLORE) return "workout";
  if (intent === PhaseIntent.REFLECT) return "closer";
  return "workout";
}

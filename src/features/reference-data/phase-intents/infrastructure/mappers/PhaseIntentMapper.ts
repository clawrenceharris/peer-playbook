import { PhaseIntent } from "../../domain/types/PhaseIntent";

export type PhaseIntentRecord = {
  id: string;
  key: string;
};
export class PhaseIntentMapper {
  static toDomain(phaseIntent: PhaseIntentRecord): PhaseIntent {
    if (phaseIntent.key === "activate" || phaseIntent.id === "activate") {
      return PhaseIntent.ACTIVATE;
    }
    if (phaseIntent.key === "explore" || phaseIntent.id === "explore") {
      return PhaseIntent.EXPLORE;
    }
    if (phaseIntent.key === "apply" || phaseIntent.id === "apply") {
      return PhaseIntent.APPLY;
    }
    if (phaseIntent.key === "reflect" || phaseIntent.id === "reflect") {
      return PhaseIntent.REFLECT;
    }
    if (phaseIntent.key === "transition" || phaseIntent.id === "transition") {
      return PhaseIntent.TRANSITION;
    }
    throw new Error("Invalid phase intent");
  }
}

import { PlaybookPhaseDTO } from "../../application/dto";
import { PlaybookPhaseRecord } from "../selection/playbook.selections";

export class PlaybookPhaseMapper {
  static toIntentKey(
    key: string,
  ): "activate" | "explore" | "apply" | "reflect" {
    switch (key) {
      case "activate":
        return "activate";
      case "explore":
        return "explore";
      case "apply":
        return "apply";
      case "reflect":
        return "reflect";
      default:
        throw new Error(`Invalid phase intent key: ${key}`);
    }
  }
  static toDetail(record: PlaybookPhaseRecord): PlaybookPhaseDTO {
    return {
      id: record.id,
      title: record.title,
      description: record.description,
      objective: record.objective,
      estimatedMinutes: record.estimated_minutes,
      position: record.position,
      intent: {
        id: record.phase_intents.id,
        key: PlaybookPhaseMapper.toIntentKey(record.phase_intents.key),
        title: record.phase_intents.label,
        description: record.phase_intents.description,
        sortOrder: record.phase_intents.sort_order,
      },
    };
  }
}

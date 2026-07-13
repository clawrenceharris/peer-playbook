import { PlaybookPagePhaseDTO } from "../../application/dto";
import { PlaybookPhaseRecord } from "../selection/playbook.selections";

export class PlaybookPhaseMapper {
  static toPagePhase(record: PlaybookPhaseRecord): PlaybookPagePhaseDTO {
    return {
      id: record.id,
      title: record.title,
      description: record.description,
      objective: record.objective,
      estimatedMinutes: record.estimated_minutes,
      position: record.position,
      intent: {
        id: record.phase_intents.id,
        key: record.phase_intents.key,
        label: record.phase_intents.label,
        colorToken: record.phase_intents.color_token,
        iconName: record.phase_intents.icon_name,
        description: record.phase_intents.description,
        sortOrder: record.phase_intents.sort_order,
      },
    };
  }
}

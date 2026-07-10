import { PlaybookPagePhaseDTO } from "../../application/dto";

export type PlaybookPhaseRecord = {
  id: string;
  title: string;
  description: string | null;
  objective: string | null;
  estimated_minutes: number | null;
  position: number;
  phase_intents: {
    id: string;
    key: string;
    label: string;
    description: string;
    color_token: string;
    icon_name: string | null;
    sort_order: number;
  };
};

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

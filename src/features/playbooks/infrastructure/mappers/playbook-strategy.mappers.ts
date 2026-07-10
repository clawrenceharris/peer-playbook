import {
  PlaybookStrategyCardDTO,
  PlaybookStrategyDetailDTO,
} from "../../application/dto";

export type PlaybookStrategyRecord = {
  id: string;
  title: string;
  phase: string;
  playbook_phase_id: string | null;
  steps: string[];
  created_at: Date;
  updated_at: Date | null;
};

export class PlaybookStrategyMapper {
  static toCard(data: PlaybookStrategyRecord): PlaybookStrategyCardDTO {
    return {
      id: data.id,
      title: data.title,
      phase: data.phase,
      playbookPhaseId: data.playbook_phase_id,
    };
  }
  static toDetail(record: PlaybookStrategyRecord): PlaybookStrategyDetailDTO {
    return {
      id: record.id,
      title: record.title,
      phase: record.phase,
      playbookPhaseId: record.playbook_phase_id,
      steps: record.steps,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      resources: [],
    };
  }
}

import {
  PlaybookStrategyCardDTO,
  PlaybookStrategyDetailDTO,
} from "../../application/dto";
import {
  PlaybookStrategyCardRecord,
  PlaybookStrategyDetailRecord,
} from "../selection/playbook-strategy.seletions";

export class PlaybookStrategyMapper {
  static toCard(data: PlaybookStrategyCardRecord): PlaybookStrategyCardDTO {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      phase: data.phase,
      playbookPhaseId: data.playbook_phase_id,
      category: data.category,
      sourceId: data.source_id,
      sourceType: data.source_type,
      position: data.position,
    };
  }
  static toDetail(
    record: PlaybookStrategyDetailRecord,
  ): PlaybookStrategyDetailDTO {
    return {
      slug: record.slug,
      id: record.id,
      title: record.title,
      phase: record.phase,
      playbookPhaseId: record.playbook_phase_id,
      category: record.category,
      sourceId: record.source_id,
      sourceType: record.source_type,
      position: record.position,
      steps: record.steps,
      facilitatorNotes: record.facilitator_notes,
      estimatedMinutes: record.estimated_minutes,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      resources: [],
    };
  }
}

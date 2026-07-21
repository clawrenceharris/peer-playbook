import { PlaybookCardDTO, PlaybookDetailDTO } from "../../application/dto";
import { Playbook } from "../../domain/entities/Playbook";
import {
  PlaybookCardRecord,
  PlaybookDetailRecord,
} from "../selection/playbook.selections";
import { PlaybookPhaseMapper } from "./PlaybookPhaseMapper";
import { PlaybookStrategyMapper } from "./PlaybookStrategyMapper";

export class PlaybookMapper {
  static toCard(record: PlaybookCardRecord): PlaybookCardDTO {
    return {
      id: record.id,
      title: record.title,
      topic: record.topic,
      courseName: record.course_name,
      subject: record.subject,
      createdBy: record.created_by,
      createdAt: record.created_at,
      published: record.published ?? false,
      updatedAt: record.updated_at ?? null,
    };
  }
  static toDomain(record: PlaybookDetailRecord): Playbook {
    return new Playbook({
      id: record.id,
      title: record.title,
      topic: record.topic,
      courseName: record.course_name,
      subject: record.subject,
      createdBy: record.created_by,
      createdAt: record.created_at,
      strategies: record.playbook_strategies.map(PlaybookStrategyMapper.toCard),
    });
  }

  static toDetail(record: PlaybookDetailRecord): PlaybookDetailDTO {
    return {
      id: record.id,
      title: record.title,
      topic: record.topic,
      courseName: record.course_name,
      subject: record.subject,
      createdBy: record.created_by,
      methodology: null,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      published: record.published ?? false,
      strategies: record.playbook_strategies.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        phase: s.phase,
        playbookPhaseId: s.playbook_phase_id ?? null,
        category: s.category,
        sourceId: s.source_id,
        sourceType: s.source_type,
        position: s.position,
      })),
      phases: record.playbook_phases.map(PlaybookPhaseMapper.toDetail),
    };
  }
}

import { PlaybookCardDTO, PlaybookDetailDTO } from "../../application/dto";
import { Playbook } from "../../domain/entities/Playbook";
import {
  PlaybookCardRecord,
  PlaybookDetailRecord,
} from "../selection/playbook.selections";
import { PlaybookStrategyMapper } from "./PlaybookStrategyMapper";

export class PlaybookMapper {
  static toCard(data: PlaybookCardRecord): PlaybookCardDTO {
    return {
      id: data.id,
      title: data.title,
      topic: data.topic,
      courseName: data.course_name,
      subject: data.subject,
      createdBy: data.created_by,
      createdAt: data.created_at,
      published: data.published ?? false,
      updatedAt: data.updated_at ?? null,
    };
  }
  static toDomain(data: PlaybookDetailRecord): Playbook {
    return new Playbook({
      id: data.id,
      title: data.title,
      topic: data.topic,
      courseName: data.course_name,
      subject: data.subject,
      createdBy: data.created_by,
      createdAt: data.created_at,
      strategies: data.playbook_strategies.map(PlaybookStrategyMapper.toCard),
    });
  }

  static toDetail(data: PlaybookDetailRecord): PlaybookDetailDTO {
    return {
      id: data.id,
      title: data.title,
      topic: data.topic,
      courseName: data.course_name,
      subject: data.subject,
      createdBy: data.created_by,
      methodology: null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      published: data.published ?? false,
      strategies: data.playbook_strategies.map((s) => ({
        id: s.id,
        slug: s.card_slug,
        title: s.title,
        phase: s.phase,
        playbookPhaseId: s.playbook_phase_id ?? null,
        category: s.category,
        sourceId: s.source_id,
        sourceType: s.source_type,
        position: s.position,
      })),
    };
  }
}

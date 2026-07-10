import { PlaybookCardDTO, PlaybookDetailDTO } from "../../application/dto";
import { Playbook } from "../../domain/entities/Playbook";

export type PlaybookRecord = {
  id: string;
  topic: string;
  course_name: string | null;
  subject: string;
  createdBy: string;
  created_at: Date;
  updated_at: Date | null;
  published: boolean | null;
};

export class PlaybookMapper {
  static toCard(data: PlaybookRecord): PlaybookCardDTO {
    return {
      id: data.id,
      topic: data.topic,
      courseName: data.course_name,
      subject: data.subject,
      createdBy: data.createdBy,
      createdAt: data.created_at,
      published: data.published ?? false,
      updatedAt: data.updated_at ?? null,
    };
  }
  static toDomain(data: PlaybookRecord): Playbook {
    return new Playbook({
      id: data.id,
      topic: data.topic,
      courseName: data.course_name,
      subject: data.subject,
      createdBy: data.createdBy,
      createdAt: data.created_at,
      strategies: [],
    });
  }

  static toDetail(data: PlaybookRecord): PlaybookDetailDTO {
    return {
      id: data.id,
      topic: data.topic,
      courseName: data.course_name,
      subject: data.subject,
      createdBy: data.createdBy,
      methodology: null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      published: data.published ?? false,
    };
  }
}

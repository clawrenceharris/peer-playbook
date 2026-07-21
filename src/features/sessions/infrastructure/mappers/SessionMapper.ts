import { SessionCardDTO, SessionDetailDTO } from "../../application/dto";
import { Session } from "../../domain/entities/Session";
import { SessionMode } from "../../domain/value-objects";
import { SessionStatus } from "../../domain/value-objects/SessionStatus";
import {
  SessionCardRecord,
  SessionDetailRecord,
} from "../selection/session.selections";

export class SessionMapper {
  static toDomain(session: SessionDetailRecord): Session {
    return new Session({
      instructorId: session.profiles.id,
      id: session.id,
      playbookId: session.playbooks?.id ?? null,
      title: session.title,
      scheduledStart: session.scheduled_start.toISOString(),
      mode: session.mode as SessionMode,
      subject: session.subject,
      topic: session.topic,
      courseName: session.course_name,
      description: session.description,
      status: session.status as SessionStatus,
    });
  }

  static toCard(session: SessionCardRecord): SessionCardDTO {
    return {
      id: session.id,
      playbookId: session.playbook_id ?? null,
      title: session.title,
      scheduledStart: session.scheduled_start.toISOString(),
      mode: session.mode as SessionMode,
      subject: session.subject,
      topic: session.topic,
      courseName: session.course_name,
      description: session.description,
      status: session.status as SessionStatus,
    };
  }

  static toDetail(session: SessionDetailRecord): SessionDetailDTO {
    return {
      id: session.id,
      playbookId: session.playbooks?.id ?? null,
      title: session.title,
      scheduledStart: session.scheduled_start.toISOString(),
      mode: session.mode as SessionMode,
      subject: session.subject,
      topic: session.topic,
      courseName: session.course_name,
      description: session.description,
      status: session.status as SessionStatus,
    };
  }
}

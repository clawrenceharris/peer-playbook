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
      createdAt: session.created_at.toISOString(),
      courseName: session.course_name,
      description: session.description,
      status: session.status as SessionStatus,
    });
  }

  static toCard(session: SessionCardRecord): SessionCardDTO {
    return {
      id: session.id,
      sessionCode: session.session_code,
      updatedAt: session.updated_at.toISOString(),
      playbookId: session.playbook_id ?? null,
      title: session.title,
      scheduledStart: session.scheduled_start.toISOString(),
      mode: session.mode as SessionMode,
      createdAt: session.created_at.toISOString(),
      subject: session.subject,
      topic: session.topic,
      courseName: session.course_name,
      description: session.description,
      status: session.status as SessionStatus,
      instructor: {
        id: session.profiles.id,
        displayName:
          session.profiles.first_name + " " + session.profiles.last_name,
        avatarUrl: session.profiles.avatar_url,
      },
    };
  }

  static toDetail(session: SessionDetailRecord): SessionDetailDTO {
    return {
      id: session.id,
      sessionCode: session.session_code,
      playbookId: session.playbooks?.id ?? null,
      title: session.title,
      scheduledStart: session.scheduled_start.toISOString(),
      mode: session.mode as SessionMode,
      subject: session.subject,
      topic: session.topic,
      courseName: session.course_name,
      description: session.description,
      status: session.status as SessionStatus,
      createdAt: session.created_at.toISOString(),
    };
  }
}

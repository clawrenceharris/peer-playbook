import { PrismaClient, session_mode } from "@/lib/db/client";
import { SessionWritePort } from "../../application/ports";
import {
  CreateSessionResult,
  UpdateSessionResult,
} from "../../application/dto";
import { CreateSessionCommand, UpdateSessionCommand } from "../../domain/types";
import { SessionMapper } from "../mappers/SessionMapper";
import { sessionDetailSelection } from "../selection/session.selections";
import { UpdateSessionStatusResult } from "../../application/dto";
import { UpdateSessionStatusCommand } from "../../domain/types/UpdateSessionStatusCommand";
import { SessionStatus } from "../../domain/value-objects";

export class PrismaSessionWriteRepository implements SessionWritePort {
  constructor(private readonly prisma: PrismaClient) {}
  async createSession(
    data: CreateSessionCommand,
  ): Promise<CreateSessionResult> {
    const record = await this.prisma.public_sessions.create({
      data: {
        playbook_id: data.playbookId,
        instructor_id: data.instructorId,
        title: data.title,
        scheduled_start: new Date(data.scheduledStart),
        mode: data.mode as session_mode,
        subject: data.subject,
        topic: data.topic,
        course_name: data.courseName,
        description: data.description,
        status: data.status,
      },
      ...sessionDetailSelection,
    });
    return SessionMapper.toDetail(record);
  }
  async updateSessionStatus(
    data: UpdateSessionStatusCommand,
  ): Promise<UpdateSessionStatusResult> {
    const record = await this.prisma.public_sessions.update({
      where: { id: data.sessionId },
      data: { status: data.status },
    });
    return {
      code: record.session_code ?? "",
      id: record.id,
      instructorId: record.instructor_id,
      status: record.status as SessionStatus,
    };
  }
  async deleteSession(sessionId: string): Promise<void> {
    await this.prisma.public_sessions.delete({
      where: { id: sessionId },
    });
  }
  async updateSession(
    sessionId: string,
    data: UpdateSessionCommand,
  ): Promise<UpdateSessionResult> {
    const record = await this.prisma.public_sessions.update({
      where: { id: sessionId },
      data: {
        title: data.title,
        topic: data.topic,
        course_name: data.courseName,
        scheduled_start: data.scheduledStart
          ? new Date(data.scheduledStart)
          : undefined,
        mode: data.mode as session_mode,
      },
    });
    return {
      sessionId: record.id,
      instructorId: record.instructor_id,
    };
  }
}

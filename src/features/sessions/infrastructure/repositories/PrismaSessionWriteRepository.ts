import { PrismaClient } from "@/lib/db/client";
import { SessionWriteRepository } from "../../domain/repositories/SessionWriteRepository";
import { CreateSessionResult } from "../../application/dto";
import { CreateSessionCommand } from "../../domain/types";
import { SessionMapper } from "../mappers/SessionMapper";
import { sessionDetailSelection } from "../selection/session.selections";

export class PrismaSessionWriteRepository implements SessionWriteRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async createSession(
    data: CreateSessionCommand,
  ): Promise<CreateSessionResult> {
    const session = await this.prisma.public_sessions.create({
      data: {
        playbook_id: data.playbookId,
        instructor_id: data.instructorId,
        title: data.title,
        scheduled_start: new Date(data.scheduledStart),
        mode: data.mode,
        subject: data.subject,
        topic: data.topic,
        course_name: data.courseName,
        description: data.description,
        status: data.status,
      },
      ...sessionDetailSelection,
    });
    return SessionMapper.toDetail(session);
  }
}

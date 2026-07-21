import { SessionStatus, SessionMode } from "../value-objects";

type SessionProps = {
  id: string;
  playbookId: string | null;
  title: string;
  scheduledStart: string;
  mode: SessionMode;
  subject: string | null;
  topic: string | null;
  courseName: string | null;
  description: string | null;
  status: SessionStatus;
  instructorId: string;
};

export class Session {
  constructor(public readonly props: SessionProps) {}

  get id(): string {
    return this.props.id;
  }

  get playbookId(): string | null {
    return this.props.playbookId;
  }

  get title(): string {
    return this.props.title;
  }

  get scheduledStart(): string {
    return this.props.scheduledStart;
  }
  get instructorId(): string {
    return this.props.instructorId;
  }

  get mode(): SessionMode {
    return this.props.mode;
  }

  get subject(): string | null {
    return this.props.subject;
  }

  get topic(): string | null {
    return this.props.topic;
  }

  get courseName(): string | null {
    return this.props.courseName;
  }

  get description(): string | null {
    return this.props.description;
  }

  get status(): SessionStatus {
    return this.props.status;
  }

  markAsCompleted(): void {
    this.props.status = SessionStatus.COMPLETED;
  }

  markAsCanceled(): void {
    this.props.status = SessionStatus.CANCELED;
  }

  markAsScheduled(): void {
    this.props.status = SessionStatus.SCHEDULED;
  }
}

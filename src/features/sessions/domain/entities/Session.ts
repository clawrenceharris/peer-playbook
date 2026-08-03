import { SessionStatus, SessionMode } from "../value-objects";

export class InvalidSessionTransitionError extends Error {
  constructor(current: SessionStatus, next: SessionStatus) {
    super(`Cannot transition a ${current} session to ${next}`);
    this.name = "InvalidSessionTransitionError";
  }
}

const allowedTransitions: Record<SessionStatus, readonly SessionStatus[]> = {
  [SessionStatus.SCHEDULED]: [SessionStatus.ACTIVE, SessionStatus.CANCELED],
  [SessionStatus.ACTIVE]: [SessionStatus.COMPLETED, SessionStatus.CANCELED],
  [SessionStatus.COMPLETED]: [],
  [SessionStatus.CANCELED]: [],
};

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
  createdAt: string;
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

  get createdAt(): string {
    return this.props.createdAt;
  }

  transitionTo(next: SessionStatus): Session {
    if (next === this.status) {
      return this;
    }
    if (!allowedTransitions[this.status].includes(next)) {
      throw new InvalidSessionTransitionError(this.status, next);
    }
    return new Session({ ...this.props, status: next });
  }
}

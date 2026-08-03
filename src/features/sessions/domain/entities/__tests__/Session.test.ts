import { describe, expect, it } from "vitest";
import { InvalidSessionTransitionError, Session } from "../Session";
import { SessionMode, SessionStatus } from "../../value-objects";

function makeSession(status = SessionStatus.SCHEDULED) {
  return new Session({
    id: "session-1",
    instructorId: "user-1",
    playbookId: null,
    title: "Exam review",
    scheduledStart: "2026-08-01T10:00:00.000Z",
    mode: SessionMode.IN_PERSON,
    subject: null,
    topic: null,
    courseName: null,
    description: null,
    status,
    createdAt: "2026-08-01T09:00:00.000Z",
  });
}

describe("Session", () => {
  it("allows scheduled to active and active to completed transitions", () => {
    const active = makeSession().transitionTo(SessionStatus.ACTIVE);
    const completed = active.transitionTo(SessionStatus.COMPLETED);

    expect(active.status).toBe(SessionStatus.ACTIVE);
    expect(completed.status).toBe(SessionStatus.COMPLETED);
  });

  it("rejects transitions from terminal states", () => {
    expect(() =>
      makeSession(SessionStatus.COMPLETED).transitionTo(SessionStatus.ACTIVE),
    ).toThrow(InvalidSessionTransitionError);
    expect(() =>
      makeSession(SessionStatus.CANCELED).transitionTo(SessionStatus.SCHEDULED),
    ).toThrow(InvalidSessionTransitionError);
  });
});

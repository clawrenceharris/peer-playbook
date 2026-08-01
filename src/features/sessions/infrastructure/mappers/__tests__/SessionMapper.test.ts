import { describe, expect, it } from "vitest";
import type { SessionDetailRecord, SessionListItemRecord } from "../../selection/session.selections";
import { SessionMapper } from "../SessionMapper";

const listItem = {
  id: "session-1",
  session_code: "ABC123",
  updated_at: new Date("2026-01-02T10:00:00Z"),
  title: "Review session",
  playbook_id: null,
  scheduled_start: new Date("2026-01-03T10:00:00Z"),
  mode: "in-person",
  created_at: new Date("2026-01-01T10:00:00Z"),
  profiles: {
    id: "user-1",
    avatar_url: null,
    first_name: "Ada",
    last_name: "Lovelace",
  },
  subject: null,
  topic: "Mitosis",
  course_name: null,
  description: null,
  status: "scheduled",
} as unknown as SessionListItemRecord;

const detail = {
  id: "session-1",
  session_code: "ABC123",
  updated_at: new Date("2026-01-02T10:00:00Z"),
  title: "Review session",
  playbooks: null,
  profiles: { id: "user-1" },
  scheduled_start: new Date("2026-01-03T10:00:00Z"),
  mode: "in-person",
  subject: null,
  topic: "Mitosis",
  created_at: new Date("2026-01-01T10:00:00Z"),
  course_name: null,
  description: null,
  status: "scheduled",
} as unknown as SessionDetailRecord;

describe("SessionMapper", () => {
  it("maps list records to the reusable session list projection", () => {
    expect(SessionMapper.toListItem(listItem)).toEqual({
      id: "session-1",
      sessionCode: "ABC123",
      updatedAt: "2026-01-02T10:00:00.000Z",
      playbookId: null,
      title: "Review session",
      scheduledStart: "2026-01-03T10:00:00.000Z",
      mode: "in-person",
      createdAt: "2026-01-01T10:00:00.000Z",
      subject: null,
      topic: "Mitosis",
      courseName: null,
      description: null,
      status: "scheduled",
      instructor: {
        id: "user-1",
        displayName: "Ada Lovelace",
        avatarUrl: null,
      },
    });
  });

  it("maps optional playbook relationships to null in detail output", () => {
    expect(SessionMapper.toDetail(detail)).toEqual(
      expect.objectContaining({
        playbookId: null,
        topic: "Mitosis",
        scheduledStart: "2026-01-03T10:00:00.000Z",
      }),
    );
  });
});

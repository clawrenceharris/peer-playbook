import { describe, expect, it } from "vitest";
import { PlaybookMapper } from "../PlaybookMapper";
import { PlaybookPhaseMapper } from "../PlaybookPhaseMapper";
import type { PlaybookDetailRecord, PlaybookPhaseRecord } from "../../selection/playbook.selections";

const phase = {
  id: "phase-1",
  title: "Warmup",
  description: "Connect to prior knowledge.",
  objective: "Activate prior knowledge.",
  estimated_minutes: 10,
  position: 0,
  phase_intent_id: "intent-1",
  phase_intents: {
    id: "intent-1",
    description: "Start the lesson.",
    key: "activate",
    label: "Activate",
    color_token: "blue",
    icon_name: "sparkles",
    sort_order: 0,
  },
} as PlaybookPhaseRecord;

const detail = {
  id: "playbook-1",
  title: "Cell Division Review",
  topic: "Mitosis",
  course_name: null,
  subject: "Biology",
  created_by: "user-1",
  created_at: new Date("2026-01-01"),
  updated_at: null,
  published: null,
  playbook_phases: [phase],
  playbook_strategies: [
    {
      id: "strategy-1",
      slug: "brainstorm",
      category: "discussion",
      title: "Brainstorm",
      steps: ["Share ideas"],
      description: "Generate ideas.",
      created_at: new Date("2026-01-01"),
      updated_at: new Date("2026-01-02"),
      phase: "warmup",
      position: 0,
      source_id: "strategy-source-1",
      source_type: "system",
      playbook_phase_id: "phase-1",
    },
  ],
} as PlaybookDetailRecord;

describe("PlaybookMapper", () => {
  it("maps persistence fields to the detail DTO and preserves phase relationships", () => {
    expect(PlaybookMapper.toDetail(detail)).toEqual(
      expect.objectContaining({
        title: "Cell Division Review",
        courseName: null,
        published: false,
        strategies: [
          expect.objectContaining({
            playbookPhaseId: "phase-1",
            sourceType: "system",
          }),
        ],
        phases: [
          expect.objectContaining({
            estimatedMinutes: 10,
            intent: expect.objectContaining({ key: "activate" }),
          }),
        ],
      }),
    );
  });

  it("maps strategy records to the domain shape without persistence names", () => {
    const domain = PlaybookMapper.toDomain(detail);

    expect(domain.strategies[0]).toEqual(
      expect.objectContaining({
        id: "strategy-1",
        playbookPhaseId: "phase-1",
        sourceId: "strategy-source-1",
      }),
    );
  });
});

describe("PlaybookPhaseMapper", () => {
  it("rejects unknown phase intent keys at the boundary", () => {
    expect(() => PlaybookPhaseMapper.toIntentKey("unknown")).toThrow(
      "Invalid phase intent key: unknown",
    );
  });
});

import { AppErrorCode } from "@/types/error.types";
import { ApplicationError } from "@/shared/utils";
import { describe, expect, it, vi } from "vitest";
import { GeneratePlaybookUseCase } from "../GeneratePlaybookUseCase";

const input = {
  userId: "user-1",
  title: "Exam review",
  topic: "Cell division",
  subject: "Biology",
  courseName: "BIO 101",
  contexts: ["exam-review"],
  modes: ["in-person"] as ("in-person" | "virtual" | "hybrid")[],
  instructions: "Prioritize collaboration.",
};

const plan = {
  strategies: [
    { slug: "brainstorm", phase: "warmup" as const },
    { slug: "practice-problems", phase: "workout" as const },
    { slug: "exit-ticket", phase: "closer" as const },
  ],
};

const catalog = [
  { id: "strategy-1", slug: "brainstorm" },
  { id: "strategy-2", slug: "practice-problems" },
  { id: "strategy-3", slug: "exit-ticket" },
];

describe("GeneratePlaybookUseCase", () => {
  it("persists generated strategies in their phase-aware playbook phases", async () => {
    const createPlaybook = vi.fn().mockResolvedValue({
      id: "playbook-1",
      topic: input.topic,
    });
    const planner = { plan: vi.fn().mockResolvedValue({ plan, catalog }) };
    const useCase = new GeneratePlaybookUseCase(
      { createPlaybook } as never,
      planner as never,
    );

    const result = await useCase.execute(input);

    expect(result).toEqual({
      success: true,
      data: { id: "playbook-1", topic: input.topic },
    });
    expect(createPlaybook).toHaveBeenCalledWith(
      expect.objectContaining({
        title: input.title,
        topic: input.topic,
        createdBy: input.userId,
        phases: [
          expect.objectContaining({
            title: "Warmup",
            intentKey: "activate",
            strategies: [{ sourceType: "system", sourceId: "strategy-1" }],
          }),
          expect.objectContaining({
            title: "Workout",
            intentKey: "apply",
            strategies: [{ sourceType: "system", sourceId: "strategy-2" }],
          }),
          expect.objectContaining({
            title: "Closer",
            intentKey: "reflect",
            strategies: [{ sourceType: "system", sourceId: "strategy-3" }],
          }),
        ],
      }),
    );
  });

  it("returns planner validation failures without attempting a database write", async () => {
    const createPlaybook = vi.fn();
    const planner = {
      plan: vi
        .fn()
        .mockRejectedValue(ApplicationError.validation("Unknown strategy")),
    };
    const useCase = new GeneratePlaybookUseCase(
      { createPlaybook } as never,
      planner as never,
    );

    const result = await useCase.execute(input);

    expect(result).toEqual({
      success: false,
      error: expect.objectContaining({ code: AppErrorCode.VALIDATION_FAILED }),
    });
    expect(createPlaybook).not.toHaveBeenCalled();
  });
});

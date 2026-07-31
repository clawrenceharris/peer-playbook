import { AppErrorCode } from "@/types/error.types";
import { describe, expect, it, vi } from "vitest";
import { PlaybookGenerationPlanner } from "../PlaybookGenerationPlanner";

const catalog = [
  {
    id: "strategy-1",
    slug: "brainstorm",
    title: "Brainstorm",
    description: "Generate initial ideas.",
    category: "discussion",
    goodFor: ["review"],
  },
  {
    id: "strategy-2",
    slug: "practice-problems",
    title: "Practice Problems",
    description: "Solve problems together.",
    category: "practice",
    goodFor: ["application"],
  },
  {
    id: "strategy-3",
    slug: "exit-ticket",
    title: "Exit Ticket",
    description: "Reflect on learning.",
    category: "reflection",
    goodFor: ["reflection"],
  },
];

const request = {
  title: "Exam review",
  subject: "Biology",
  topic: "Cell division",
  courseName: "BIO 101",
  contexts: ["exam-review"],
  modes: ["in-person"] as ("in-person" | "virtual" | "hybrid")[],
  instructions: "Prioritize collaboration.",
};

const validPlan = {
  strategies: [
    { slug: "brainstorm", phase: "warmup" as const },
    { slug: "practice-problems", phase: "workout" as const },
    { slug: "exit-ticket", phase: "closer" as const },
  ],
};

function makePlanner(
  response: unknown = validPlan,
  options: { catalog?: typeof catalog; error?: Error } = {},
) {
  const listForPlaybookGeneration = vi
    .fn()
    .mockResolvedValue(options.catalog ?? catalog);
  const completeJson = options.error
    ? vi.fn().mockRejectedValue(options.error)
    : vi.fn().mockResolvedValue(response);
  const planner = new PlaybookGenerationPlanner(
    { listForPlaybookGeneration },
    { completeJson },
    undefined,
    [
      {
        key: "blooms-apply",
        title: "Bloom's taxonomy",
        description: "Favor application and analysis activities.",
        bullets: ["Use collaborative practice."],
      },
    ],
  );

  return { planner, listForPlaybookGeneration, completeJson };
}

describe("PlaybookGenerationPlanner", () => {
  it("builds a context-aware prompt and returns a valid catalog-backed plan", async () => {
    const { planner, listForPlaybookGeneration, completeJson } = makePlanner();

    const result = await planner.plan(request);

    expect(result).toEqual({ plan: validPlan, catalog });
    expect(listForPlaybookGeneration).toHaveBeenCalledWith(["exam-review"]);
    expect(completeJson).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.stringContaining("Bloom's taxonomy"),
      }),
    );
  });

  it("rejects generation before calling the provider when too few strategies match", async () => {
    const { planner, completeJson } = makePlanner(validPlan, {
      catalog: catalog.slice(0, 2),
    });

    await expect(planner.plan(request)).rejects.toMatchObject({
      code: AppErrorCode.VALIDATION_FAILED,
    });
    expect(completeJson).not.toHaveBeenCalled();
  });

  it("rejects malformed, duplicate, and unknown AI strategy selections", async () => {
    const malformed = makePlanner({ strategies: [] });
    await expect(malformed.planner.plan(request)).rejects.toMatchObject({
      code: AppErrorCode.VALIDATION_FAILED,
    });

    const duplicate = makePlanner({
      strategies: [
        { slug: "brainstorm", phase: "warmup" },
        { slug: "brainstorm", phase: "workout" },
        { slug: "exit-ticket", phase: "closer" },
      ],
    });
    await expect(duplicate.planner.plan(request)).rejects.toMatchObject({
      code: AppErrorCode.VALIDATION_FAILED,
    });

    const unknown = makePlanner({
      strategies: [
        { slug: "brainstorm", phase: "warmup" },
        { slug: "not-in-catalog", phase: "workout" },
        { slug: "exit-ticket", phase: "closer" },
      ],
    });
    await expect(unknown.planner.plan(request)).rejects.toMatchObject({
      code: AppErrorCode.VALIDATION_FAILED,
    });
  });

  it("maps malformed JSON and provider failures to distinct application errors", async () => {
    const malformedJson = makePlanner(validPlan, {
      error: new SyntaxError("Unexpected token"),
    });
    await expect(malformedJson.planner.plan(request)).rejects.toMatchObject({
      code: AppErrorCode.VALIDATION_FAILED,
    });

    const providerFailure = makePlanner(validPlan, {
      error: new Error("Provider unavailable"),
    });
    await expect(providerFailure.planner.plan(request)).rejects.toMatchObject({
      code: AppErrorCode.UNKNOWN_ERROR,
    });
  });
});

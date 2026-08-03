import { AppErrorCode } from "@/types/error.types";
import { describe, expect, it, vi } from "vitest";
import { CreatePlaybookUseCase } from "../CreatePlaybookUseCase";
import { UpdatePlaybookUseCase } from "../UpdatePlaybookUseCase";

describe("playbook metadata use cases", () => {
  it("normalizes required metadata before creating a playbook", async () => {
    const createPlaybook = vi.fn().mockResolvedValue({ id: "playbook-1" });
    const useCase = new CreatePlaybookUseCase({ createPlaybook } as never);

    await useCase.execute({
      userId: "user-1",
      title: "  Exam review  ",
      topic: "  Cell division  ",
      contexts: [],
      modes: [],
      warmup: [],
      workout: [],
      closer: [],
      phases: [],
    });

    expect(createPlaybook).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Exam review",
        topic: "Cell division",
      }),
    );
  });

  it("rejects blank required metadata before writing", async () => {
    const updatePlaybook = vi.fn();
    const useCase = new UpdatePlaybookUseCase({ updatePlaybook } as never);

    const result = await useCase.execute({
      id: "playbook-1",
      title: "   ",
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: AppErrorCode.VALIDATION_FAILED },
    });
    expect(updatePlaybook).not.toHaveBeenCalled();
  });

  it("surfaces unresolved phase references as validation failures", async () => {
    const createPlaybook = vi
      .fn()
      .mockRejectedValue(new Error("Missing phase intent: explore"));
    const useCase = new CreatePlaybookUseCase({ createPlaybook } as never);

    const result = await useCase.execute({
      userId: "user-1",
      title: "Exam review",
      topic: "Cell division",
      contexts: [],
      modes: [],
      warmup: [],
      workout: [],
      closer: [],
      phases: [],
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: AppErrorCode.VALIDATION_FAILED },
    });
  });

  it("normalizes unexpected metadata write failures", async () => {
    const updatePlaybook = vi
      .fn()
      .mockRejectedValue(new Error("database unavailable"));
    const useCase = new UpdatePlaybookUseCase({ updatePlaybook } as never);

    const result = await useCase.execute({
      id: "playbook-1",
      title: "Exam review",
    });

    expect(result).toMatchObject({
      success: false,
      error: { details: { code: AppErrorCode.UNKNOWN_ERROR } },
    });
  });
});

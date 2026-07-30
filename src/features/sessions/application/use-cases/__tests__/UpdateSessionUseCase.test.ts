import { describe, expect, it, vi } from "vitest";
import { UpdateSessionUseCase } from "../UpdateSessionUseCase";

describe("UpdateSessionUseCase", () => {
  it("passes only supported changes to the write port", async () => {
    const updateSession = vi.fn().mockResolvedValue({
      sessionId: "session-1",
      instructorId: "instructor-1",
    });
    const useCase = new UpdateSessionUseCase({ updateSession } as never);

    const result = await useCase.execute({
      sessionId: "session-1",
      title: "Final exam review",
      mode: "hybrid",
    });

    expect(result.success).toBe(true);
    expect(updateSession).toHaveBeenCalledWith("session-1", {
      title: "Final exam review",
      mode: "hybrid",
    });
  });
});

import { AppErrorCode } from "@/types/error.types";
import { describe, expect, it, vi } from "vitest";
import { UpdateSessionStatusUseCase } from "../UpdateSessionStatusUseCase";

const session = {
  id: "session-1",
  instructorId: "user-1",
  sessionCode: null,
  playbookId: null,
  title: "Exam review",
  scheduledStart: "2026-08-01T10:00:00.000Z",
  mode: "in-person",
  subject: null,
  topic: null,
  courseName: null,
  description: null,
  status: "scheduled",
  createdAt: "2026-08-01T09:00:00.000Z",
} as const;

describe("UpdateSessionStatusUseCase", () => {
  it("persists a valid session transition", async () => {
    const updateSessionStatus = vi.fn().mockResolvedValue({
      id: "session-1",
      code: "ABC123",
      instructorId: "user-1",
      status: "active",
    });
    const useCase = new UpdateSessionStatusUseCase(
      { updateSessionStatus } as never,
      { findDetailById: vi.fn().mockResolvedValue(session) } as never,
    );

    const result = await useCase.execute({
      sessionId: "session-1",
      status: "active",
    });

    expect(result.success).toBe(true);
    expect(updateSessionStatus).toHaveBeenCalledWith({
      sessionId: "session-1",
      status: "active",
    });
  });

  it("rejects invalid transitions before writing", async () => {
    const updateSessionStatus = vi.fn();
    const useCase = new UpdateSessionStatusUseCase(
      { updateSessionStatus } as never,
      {
        findDetailById: vi.fn().mockResolvedValue({
          ...session,
          status: "completed",
        }),
      } as never,
    );

    const result = await useCase.execute({
      sessionId: "session-1",
      status: "active",
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: AppErrorCode.VALIDATION_FAILED },
    });
    expect(updateSessionStatus).not.toHaveBeenCalled();
  });

  it("returns not found when the session does not exist", async () => {
    const updateSessionStatus = vi.fn();
    const useCase = new UpdateSessionStatusUseCase(
      { updateSessionStatus } as never,
      { findDetailById: vi.fn().mockResolvedValue(null) } as never,
    );

    const result = await useCase.execute({
      sessionId: "missing-session",
      status: "active",
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: AppErrorCode.RESOURCE_NOT_FOUND },
    });
    expect(updateSessionStatus).not.toHaveBeenCalled();
  });
});

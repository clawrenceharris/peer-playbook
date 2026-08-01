import { AppErrorCode } from "@/types/error.types";
import { describe, expect, it, vi } from "vitest";
import {
  GetSessionByCodeUseCase,
  GetSessionDetailByIdUseCase,
  ListUserSessionsUseCase,
} from "../SessionReadQueries";

function makePort() {
  return {
    findByCode: vi.fn(),
    findDetailById: vi.fn(),
    listByUserId: vi.fn(),
  };
}

describe("session read queries", () => {
  it("uses the matching port method for each session read task", async () => {
    const port = makePort();
    port.findByCode.mockResolvedValue({ id: "session-1" });
    port.findDetailById.mockResolvedValue({ id: "session-1" });
    port.listByUserId.mockResolvedValue([{ id: "session-1" }]);

    await new GetSessionByCodeUseCase(port as never).execute("ABC123");
    await new GetSessionDetailByIdUseCase(port as never).execute("session-1");
    await new ListUserSessionsUseCase(port as never).execute("user-1");

    expect(port.findByCode).toHaveBeenCalledWith("ABC123");
    expect(port.findDetailById).toHaveBeenCalledWith("session-1");
    expect(port.listByUserId).toHaveBeenCalledWith("user-1");
  });

  it("returns a normalized failure when a port throws", async () => {
    const port = makePort();
    port.findByCode.mockRejectedValue(new Error("Database unavailable"));

    await expect(new GetSessionByCodeUseCase(port as never).execute("ABC123"))
      .resolves.toMatchObject({
        success: false,
        error: { code: AppErrorCode.UNKNOWN_ERROR },
      });
  });
});

import { AppErrorCode } from "@/types/error.types";
import { describe, expect, it, vi } from "vitest";
import {
  GetProfileByIdUseCase,
  GetProfileCardByIdUseCase,
  GetProfileDetailByEmailUseCase,
  GetProfileDetailByIdUseCase,
} from "../ProfileReadQueries";

function makePort() {
  return {
    findProfileById: vi.fn(),
    findProfileCardById: vi.fn(),
    findProfileDetailById: vi.fn(),
    findProfileDetailByEmail: vi.fn(),
  };
}

describe("profile read queries", () => {
  it("returns each profile read model from its focused query", async () => {
    const port = makePort();
    port.findProfileById.mockResolvedValue({ id: "profile-1" });
    port.findProfileCardById.mockResolvedValue({ id: "profile-1" });
    port.findProfileDetailById.mockResolvedValue({ id: "profile-1" });
    port.findProfileDetailByEmail.mockResolvedValue({ id: "profile-1" });

    await expect(new GetProfileByIdUseCase(port as never).execute("profile-1"))
      .resolves.toMatchObject({ success: true, data: { id: "profile-1" } });
    await expect(new GetProfileCardByIdUseCase(port as never).execute("profile-1"))
      .resolves.toMatchObject({ success: true, data: { id: "profile-1" } });
    await expect(
      new GetProfileDetailByIdUseCase(port as never).execute("profile-1"),
    ).resolves.toMatchObject({ success: true, data: { id: "profile-1" } });
    await expect(
      new GetProfileDetailByEmailUseCase(port as never).execute("ada@example.com"),
    ).resolves.toMatchObject({ success: true, data: { id: "profile-1" } });
  });

  it("normalizes repository failures", async () => {
    const port = makePort();
    port.findProfileById.mockRejectedValue(new Error("Database unavailable"));

    await expect(new GetProfileByIdUseCase(port as never).execute("profile-1"))
      .resolves.toMatchObject({
        success: false,
        error: { code: AppErrorCode.UNKNOWN_ERROR },
      });
  });
});

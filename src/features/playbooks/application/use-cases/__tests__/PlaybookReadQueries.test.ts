import { AppErrorCode } from "@/types/error.types";
import { describe, expect, it, vi } from "vitest";
import {
  GetPlaybookDetailUseCase,
  ListPlaybookContextsUseCase,
  ListSavedPlaybookIdsUseCase,
  ListUserPlaybooksUseCase,
} from "../PlaybookReadQueries";

function makePort() {
  return {
    findPlaybookDetailById: vi.fn(),
    listPlaybookContexts: vi.fn(),
    listPlaybooksByUserId: vi.fn(),
    listSavedPlaybookIdsByUserId: vi.fn(),
  };
}

describe("playbook read queries", () => {
  it("delegates each user task to its read port method", async () => {
    const port = makePort();
    port.findPlaybookDetailById.mockResolvedValue({ id: "playbook-1" });
    port.listPlaybookContexts.mockResolvedValue([{ id: "context-1" }]);
    port.listPlaybooksByUserId.mockResolvedValue([{ id: "playbook-1" }]);
    port.listSavedPlaybookIdsByUserId.mockResolvedValue(["playbook-1"]);

    await new GetPlaybookDetailUseCase(port as never).execute("playbook-1");
    await new ListPlaybookContextsUseCase(port as never).execute();
    await new ListUserPlaybooksUseCase(port as never).execute("user-1");
    await new ListSavedPlaybookIdsUseCase(port as never).execute("user-1");

    expect(port.findPlaybookDetailById).toHaveBeenCalledWith("playbook-1");
    expect(port.listPlaybookContexts).toHaveBeenCalledOnce();
    expect(port.listPlaybooksByUserId).toHaveBeenCalledWith("user-1");
    expect(port.listSavedPlaybookIdsByUserId).toHaveBeenCalledWith("user-1");
  });

  it("normalizes adapter failures without exposing infrastructure errors", async () => {
    const port = makePort();
    port.listSavedPlaybookIdsByUserId.mockRejectedValue(
      new Error("Database unavailable"),
    );

    await expect(
      new ListSavedPlaybookIdsUseCase(port as never).execute("user-1"),
    ).resolves.toMatchObject({
      success: false,
      error: { code: AppErrorCode.UNKNOWN_ERROR },
    });
  });
});

import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  playbookFindUnique: vi.fn(),
  strategyFindUnique: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    auth: {
      getUser: mocks.getUser,
    },
  })),
}));

vi.mock("@/db/client", () => ({
  db: {
    playbooks: {
      findUnique: mocks.playbookFindUnique,
    },
    playbook_strategies: {
      findUnique: mocks.strategyFindUnique,
    },
  },
}));

import {
  assertPlaybookOwnership,
  assertStrategyOwnership,
  requireCurrentUserId,
} from "../ownership";

describe("playbook ownership helpers", () => {
  it("returns the current user id from the session", async () => {
    mocks.getUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
    });

    await expect(requireCurrentUserId()).resolves.toBe("user-1");
  });

  it("rejects when a playbook is not owned by the current user", async () => {
    mocks.playbookFindUnique.mockResolvedValueOnce({ createdBy: "user-2" });

    await expect(assertPlaybookOwnership("playbook-1", "user-1")).rejects.toMatchObject(
      {
        code: "permission_denied",
      },
    );
  });

  it("rejects when a strategy is not owned by the current user", async () => {
    mocks.strategyFindUnique.mockResolvedValueOnce({
      playbooks: { createdBy: "user-2" },
    });

    await expect(assertStrategyOwnership("strategy-1", "user-1")).rejects.toMatchObject(
      {
        code: "permission_denied",
      },
    );
  });

});

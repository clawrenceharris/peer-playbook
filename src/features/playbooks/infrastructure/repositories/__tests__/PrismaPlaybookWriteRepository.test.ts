import { describe, expect, it, vi } from "vitest";
import { PrismaPlaybookWriteRepository } from "../PrismaPlaybookWriteRepository";

describe("PrismaPlaybookWriteRepository", () => {
  it("updates all phases in one transaction after resolving their intent keys", async () => {
    const findMany = vi.fn().mockResolvedValue([
      { id: "intent-activate", key: "activate" },
      { id: "intent-apply", key: "apply" },
    ]);
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const $transaction = vi.fn(async (callback) =>
      callback({
        phase_intents: { findMany },
        playbook_phases: { updateMany },
      }),
    );
    const repository = new PrismaPlaybookWriteRepository({
      $transaction,
    } as never);

    await repository.updatePlaybookPhases({
      playbookId: "playbook-1",
      phases: [
        {
          id: "phase-1",
          title: "Activate",
          intentKey: "activate",
          position: 0,
          objective: null,
          estimatedMinutes: null,
        },
        {
          id: "phase-2",
          title: "Apply",
          intentKey: "apply",
          position: 1,
          objective: null,
          estimatedMinutes: 25,
        },
      ],
    });

    expect($transaction).toHaveBeenCalledOnce();
    expect(findMany).toHaveBeenCalledWith({
      where: { key: { in: ["activate", "apply"] } },
      select: { id: true, key: true },
    });
    expect(updateMany).toHaveBeenNthCalledWith(1, {
      where: { id: "phase-1", playbook_id: "playbook-1" },
      data: expect.objectContaining({
        title: "Activate",
        phase_intent_id: "intent-activate",
        position: 0,
        estimated_minutes: null,
      }),
    });
    expect(updateMany).toHaveBeenNthCalledWith(2, {
      where: { id: "phase-2", playbook_id: "playbook-1" },
      data: expect.objectContaining({
        phase_intent_id: "intent-apply",
        estimated_minutes: 25,
      }),
    });
  });

  it("fails before any phase update when an intent key cannot be resolved", async () => {
    const updateMany = vi.fn();
    const $transaction = vi.fn(async (callback) =>
      callback({
        phase_intents: { findMany: vi.fn().mockResolvedValue([]) },
        playbook_phases: { updateMany },
      }),
    );
    const repository = new PrismaPlaybookWriteRepository({
      $transaction,
    } as never);

    await expect(
      repository.updatePlaybookPhases({
        playbookId: "playbook-1",
        phases: [
          {
            id: "phase-1",
            title: "Unknown",
            intentKey: "unknown" as never,
            position: 0,
            objective: null,
            estimatedMinutes: null,
          },
        ],
      }),
    ).rejects.toThrow("Missing phase intent: unknown");

    expect(updateMany).not.toHaveBeenCalled();
  });
});

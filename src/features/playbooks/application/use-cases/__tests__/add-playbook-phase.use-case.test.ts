import { describe, expect, it, vi } from "vitest";
import { AddPlaybookPhaseUseCase } from "../AddPlaybookPhaseUseCase";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";

describe("AddPlaybookPhaseUseCase", () => {
  it("creates a phase with resolved intent key and empty strategies", async () => {
    const createPlaybookPhase = vi.fn().mockResolvedValue({
      id: "phase-1",
      title: "Explore",
      position: 2,
      estimatedMinutes: null,
      description: null,
      objective: null,
      intent: {
        id: "intent-explore",
        key: "explore",
        title: "Explore",
        description: "Investigate",
        sortOrder: 1,
      },
    });
    const useCase = new AddPlaybookPhaseUseCase({
      createPlaybookPhase,
    } as never);

    const result = await useCase.execute({
      playbookId: "playbook-1",
      title: "Explore",
      position: 2,
      estimatedMinutes: null,
      description: null,
      objective: null,
      intent: PhaseIntent.EXPLORE,
    });

    expect(result.success).toBe(true);
    expect(createPlaybookPhase).toHaveBeenCalledWith("playbook-1", {
      title: "Explore",
      position: 2,
      intentKey: "explore",
      strategies: [],
      legacyPhase: "workout",
    });
  });
});

import { describe, expect, it, vi } from "vitest";
import { AddPlaybookStrategyUseCase } from "../AddPlaybookStrategyUseCase";
import { RemovePlaybookStrategyUseCase } from "../RemovePlaybookStrategyUseCase";
import { UpdatePlaybookStrategyUseCase } from "../UpdatePlaybookStrategyUseCase";

describe("playbook strategy use cases", () => {
  it("creates a playbook strategy from source data", async () => {
    const createPlaybookStrategy = vi.fn().mockResolvedValue({
      id: "playbook-strategy-1",
      title: "Think-Pair-Share",
      slug: "think-pair-share",
      phase: "workout",
    });
    const useCase = new AddPlaybookStrategyUseCase({
      createPlaybookStrategy,
    } as never);

    const result = await useCase.execute({
      playbookId: "playbook-1",
      playbookPhaseId: "phase-1",
      title: "Think-Pair-Share",
      slug: "think-pair-share",
      category: "discussion",
      steps: ["Think", "Pair", "Share"],
      description: "A short structured discussion sequence.",
      phase: "workout",
      position: 2,
      sourceId: "strategy-1",
      sourceType: "system",
    });

    expect(result.success).toBe(true);
    expect(createPlaybookStrategy).toHaveBeenCalledWith({
      playbookId: "playbook-1",
      playbookPhaseId: "phase-1",
      slug: "think-pair-share",
      category: "discussion",
      title: "Think-Pair-Share",
      description: "A short structured discussion sequence.",
      steps: ["Think", "Pair", "Share"],
      phase: "workout",
      position: 2,
      sourceId: "strategy-1",
      sourceType: "system",
    });
  });

  it("removes a playbook strategy by id", async () => {
    const removePlaybookStrategy = vi.fn().mockResolvedValue(undefined);
    const useCase = new RemovePlaybookStrategyUseCase({
      removePlaybookStrategy,
    } as never);

    const result = await useCase.execute({
      playbookId: "playbook-1",
      strategyId: "playbook-strategy-1",
    });

    expect(result.success).toBe(true);
    expect(removePlaybookStrategy).toHaveBeenCalledWith({
      playbookId: "playbook-1",
      strategyId: "playbook-strategy-1",
    });
  });

  it("passes replacement metadata through the update use case", async () => {
    const updatePlaybookStrategy = vi.fn().mockResolvedValue({
      id: "playbook-strategy-1",
      title: "Updated title",
      slug: "updated-title",
      phase: "workout",
    });
    const useCase = new UpdatePlaybookStrategyUseCase({
      updatePlaybookStrategy,
    } as never);

    const result = await useCase.execute({
      strategyId: "playbook-strategy-1",
      playbookId: "playbook-1",
      title: "Updated title",
      slug: "updated-title",
      category: "reflection",
      steps: ["One", "Two"],
      description: "Updated description",
      sourceId: "strategy-2",
      sourceType: "system",
    });

    expect(result.success).toBe(true);
    expect(updatePlaybookStrategy).toHaveBeenCalledWith("playbook-strategy-1", {
      title: "Updated title",
      slug: "updated-title",
      category: "reflection",
      steps: ["One", "Two"],
      description: "Updated description",
      sourceId: "strategy-2",
      sourceType: "system",
    });
  });
});


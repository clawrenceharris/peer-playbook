import { AppErrorCode } from "@/types/error.types";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import { describe, expect, it, vi } from "vitest";
import { AddPlaybookPhaseUseCase } from "../AddPlaybookPhaseUseCase";
import { AddPlaybookStrategyUseCase } from "../AddPlaybookStrategyUseCase";
import { DeletePlaybookUseCase } from "../DeletePlaybookUseCase";
import {
  AddFavoritePlaybookUseCase,
  RemoveFavoritePlaybookUseCase,
} from "../FavoritePlaybookUseCase";
import { RemovePlaybookStrategyUseCase } from "../RemovePlaybookStrategyUseCase";
import { UpdatePlaybookPhasesUseCase } from "../UpdatePlaybookPhasesUseCase";
import { UpdatePlaybookStrategyUseCase } from "../UpdatePlaybookStrategyUseCase";

describe("playbook write use cases", () => {
  it("normalizes phase positions before coordinating the phase write", async () => {
    const updatePlaybookPhases = vi.fn().mockResolvedValue(undefined);
    const useCase = new UpdatePlaybookPhasesUseCase({
      updatePlaybookPhases,
    } as never);

    const result = await useCase.execute({
      playbookId: "playbook-1",
      phases: [
        {
          id: "phase-2",
          title: "Apply",
          intentKey: "apply",
          position: 8,
          objective: null,
          estimatedMinutes: 20,
        },
        {
          id: "phase-1",
          title: "Activate",
          intentKey: "activate",
          position: 3,
          objective: null,
          estimatedMinutes: null,
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(updatePlaybookPhases).toHaveBeenCalledWith({
      playbookId: "playbook-1",
      phases: [
        expect.objectContaining({ id: "phase-2", position: 0 }),
        expect.objectContaining({ id: "phase-1", position: 1 }),
      ],
    });
  });

  it("rejects invalid phases before coordinating the phase write", async () => {
    const updatePlaybookPhases = vi.fn();
    const useCase = new UpdatePlaybookPhasesUseCase({
      updatePlaybookPhases,
    } as never);

    const result = await useCase.execute({
      playbookId: "playbook-1",
      phases: [
        {
          id: "phase-1",
          title: " ",
          intentKey: "apply",
          position: 0,
          objective: null,
          estimatedMinutes: null,
        },
      ],
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: AppErrorCode.VALIDATION_FAILED },
    });
    expect(updatePlaybookPhases).not.toHaveBeenCalled();
  });

  it("returns failures from repository-backed playbook writes", async () => {
    const error = new Error("database unavailable");
    const addPhase = new AddPlaybookPhaseUseCase({
      createPlaybookPhase: vi.fn().mockRejectedValue(error),
    } as never);
    const addStrategy = new AddPlaybookStrategyUseCase({
      createPlaybookStrategy: vi.fn().mockRejectedValue(error),
    } as never);
    const updateStrategy = new UpdatePlaybookStrategyUseCase({
      updatePlaybookStrategy: vi.fn().mockRejectedValue(error),
    } as never);
    const removeStrategy = new RemovePlaybookStrategyUseCase({
      removePlaybookStrategy: vi.fn().mockRejectedValue(error),
    } as never);
    const deletePlaybook = new DeletePlaybookUseCase({
      deletePlaybook: vi.fn().mockRejectedValue(error),
    } as never);
    const favorite = new AddFavoritePlaybookUseCase({
      addFavoritePlaybook: vi.fn().mockRejectedValue(error),
    } as never);
    const unfavorite = new RemoveFavoritePlaybookUseCase({
      removeFavoritePlaybook: vi.fn().mockRejectedValue(error),
    } as never);

    const results = await Promise.all([
      addPhase.execute({
        playbookId: "playbook-1",
        title: "Apply",
        position: 0,
        intent: PhaseIntent.APPLY,
        estimatedMinutes: null,
        description: null,
        objective: null,
      }),
      addStrategy.execute({
        playbookId: "playbook-1",
        playbookPhaseId: "phase-1",
        title: "Think",
        slug: "think",
        category: "discussion",
        steps: [],
        description: "A short discussion.",
        phase: "workout",
        position: 0,
        sourceId: "source-1",
        sourceType: "system",
      }),
      updateStrategy.execute({
        playbookId: "playbook-1",
        strategyId: "strategy-1",
        title: "Think",
      }),
      removeStrategy.execute({
        playbookId: "playbook-1",
        strategyId: "strategy-1",
      }),
      deletePlaybook.execute({ id: "playbook-1" }),
      favorite.execute({ playbookId: "playbook-1", userId: "user-1" }),
      unfavorite.execute({ playbookId: "playbook-1", userId: "user-1" }),
    ]);

    for (const result of results) {
      expect(result).toMatchObject({
        success: false,
        error: { details: { code: AppErrorCode.UNKNOWN_ERROR } },
      });
    }
  });
});

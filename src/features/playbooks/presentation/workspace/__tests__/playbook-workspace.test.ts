import { describe, expect, it, vi } from "vitest";
import { createPlaybookWorkspaceCommands } from "../playbook-workspace.commands";
import {
  createInitialPlaybookWorkspaceState,
  playbookWorkspaceReducer,
} from "../playbook-workspace.reducer";
import {
  buildPlaybookWorkspaceModel,
  buildStrategyDraft,
  strategyDraftsEqual,
} from "../playbook-workspace.selectors";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import type { GetPlaybookPageOutput } from "../../../application/dto";

describe("playbookWorkspaceReducer", () => {
  it("updates strategy title and duration on the draft without touching the baseline", () => {
    const draft = {
      title: "Think-Pair-Share",
      steps: ["Think"],
      facilitatorNotes: "",
      estimatedMinutes: "10",
    };
    let state = playbookWorkspaceReducer(
      createInitialPlaybookWorkspaceState(),
      {
        type: "setStrategyDraftSnapshot",
        draft,
      },
    );

    state = playbookWorkspaceReducer(state, {
      type: "setStrategyTitle",
      value: "Think-Pair-Share: Derivatives",
    });
    state = playbookWorkspaceReducer(state, {
      type: "setStrategyEstimatedMinutes",
      value: "15",
    });

    expect(state.strategyDraft).toEqual({
      title: "Think-Pair-Share: Derivatives",
      steps: ["Think"],
      facilitatorNotes: "",
      estimatedMinutes: "15",
    });
    expect(state.strategyBaseline).toEqual(draft);
    expect(
      strategyDraftsEqual(state.strategyDraft, state.strategyBaseline),
    ).toBe(false);
  });

  it("keeps an empty duration string so number inputs can clear mid-edit", () => {
    const state = playbookWorkspaceReducer(
      {
        ...createInitialPlaybookWorkspaceState(),
        strategyDraft: {
          title: "Strategy",
          steps: [],
          facilitatorNotes: "",
          estimatedMinutes: "10",
        },
      },
      { type: "setStrategyEstimatedMinutes", value: "" },
    );

    expect(state.strategyDraft?.estimatedMinutes).toBe("");
  });

  it("stores local phase order until drafts are cleared", () => {
    let state = playbookWorkspaceReducer(
      createInitialPlaybookWorkspaceState(),
      {
        type: "reorderPhases",
        phaseIds: ["phase-b", "phase-a"],
      },
    );

    expect(state.phaseOrder).toEqual(["phase-b", "phase-a"]);

    state = playbookWorkspaceReducer(state, { type: "clearPhaseDrafts" });
    expect(state.phaseOrder).toBeNull();
  });
});

describe("playbook workspace selectors", () => {
  const page = {
    playbook: {
      id: "playbook-1",
      courseName: null,
      methodology: null,
      subject: null,
      title: "Playbook",
      topic: "Topic",
      published: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: null,
      sessions: [],
      creator: {
        id: "user-1",
        displayName: "Caleb",
        avatarUrl: null,
      },
      phases: [
        {
          id: "phase-a",
          title: "Activate",
          position: 0,
          intent: {
            id: "intent-activate",
            key: "activate" as const,
            title: "Activate",
            sortOrder: 0,
          },
          estimatedMinutes: 5,
          objective: null,
        },
        {
          id: "phase-b",
          title: "Apply",
          position: 1,
          intent: {
            id: "intent-apply",
            key: "apply" as const,
            title: "Apply",
            sortOrder: 1,
          },
          estimatedMinutes: 20,
          objective: null,
        },
      ],
    },
    strategies: [],
  } satisfies GetPlaybookPageOutput;

  it("includes title in strategy drafts", () => {
    expect(
      buildStrategyDraft({
        title: "Jigsaw",
        steps: ["A", "B"],
        facilitatorNotes: "Note",
        estimatedMinutes: 12,
      }),
    ).toEqual({
      title: "Jigsaw",
      steps: ["A", "B"],
      facilitatorNotes: "Note",
      estimatedMinutes: "12",
    });
  });

  it("overlays phase duration drafts and respects local phase order", () => {
    const phases = buildPlaybookWorkspaceModel(
      page,
      {
        "phase-a": {
          title: "Warm start",
          intent: PhaseIntent.ACTIVATE,
          objective: null,
          estimatedMinutes: 8,
        },
      },
      ["phase-b", "phase-a"],
    );

    expect(phases.map((phase) => phase.id)).toEqual(["phase-b", "phase-a"]);
    expect(phases[0].position).toBe(0);
    expect(phases[1].title).toBe("Warm start");
    expect(phases[1].estimatedMinutes).toBe(8);
  });
});

describe("playbook workspace commands", () => {
  it("allows the same source strategy to create separate playbook instances", async () => {
    const addPlaybookStrategy = vi.fn().mockResolvedValue(undefined);
    const activePhase = {
      id: "phase-1",
      title: "Practice",
      intent: PhaseIntent.APPLY,
    };
    const commands = createPlaybookWorkspaceCommands({
      playbook: { id: "playbook-1" } as never,
      userId: "user-1",
      state: createInitialPlaybookWorkspaceState(),
      dispatch: vi.fn(),
      phases: [],
      activePhase: activePhase as never,
      activeStrategyId: null,
      activeStrategies: [],
      strategySourceByKey: new Map([
        [
          "system:strategy-1",
          {
            id: "strategy-1",
            slug: "think-pair-share",
            title: "Think-Pair-Share",
            description: "Discuss with a partner.",
            steps: ["Think", "Pair", "Share"],
            phase: PhaseIntent.APPLY,
            category: "discussion",
          },
        ],
      ]),
      addPlaybookStrategy,
      addPlaybookPhase: vi.fn(),
      reorderStrategies: vi.fn(),
      removePlaybookStrategy: vi.fn(),
      updatePlaybookStrategy: vi.fn(),
      updatePlaybookPhases: vi.fn(),
      favoritePlaybook: vi.fn(),
      unfavoritePlaybook: vi.fn(),
      deletePlaybook: vi.fn(),
      openCreateSession: vi.fn(),
      openDeleteConfirmation: vi.fn(),
    });

    await commands.addStrategy({ sourceType: "system", sourceId: "strategy-1" });
    await commands.addStrategy({ sourceType: "system", sourceId: "strategy-1" });

    expect(addPlaybookStrategy).toHaveBeenCalledTimes(2);
    expect(addPlaybookStrategy).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        playbookPhaseId: "phase-1",
        sourceId: "strategy-1",
      }),
    );
    expect(addPlaybookStrategy).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        playbookPhaseId: "phase-1",
        sourceId: "strategy-1",
      }),
    );
  });
});

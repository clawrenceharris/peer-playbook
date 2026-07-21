import { describe, expect, it } from "vitest";
import {
  insertPhaseList,
  reorderPhaseList,
} from "../../hooks/playbook-cache-updaters";

describe("playbook phase cache updaters", () => {
  it("appends a phase and reindexes positions", () => {
    const next = insertPhaseList(
      [
        { id: "a", position: 0 },
        { id: "b", position: 1 },
      ],
      { id: "c", position: 2 },
    );

    expect(next).toEqual([
      { id: "a", position: 0 },
      { id: "b", position: 1 },
      { id: "c", position: 2 },
    ]);
  });

  it("reorders phases by id list and reindexes positions", () => {
    const next = reorderPhaseList(
      [
        { id: "a", position: 0 },
        { id: "b", position: 1 },
        { id: "c", position: 2 },
      ],
      ["c", "a", "b"],
    );

    expect(next).toEqual([
      { id: "c", position: 0 },
      { id: "a", position: 1 },
      { id: "b", position: 2 },
    ]);
  });
});

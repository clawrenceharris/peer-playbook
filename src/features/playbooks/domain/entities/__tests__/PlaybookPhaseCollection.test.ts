import { describe, expect, it } from "vitest";
import {
  PlaybookPhaseCollection,
  PlaybookPhaseValidationError,
} from "../PlaybookPhaseCollection";

describe("PlaybookPhaseCollection", () => {
  it("trims titles and assigns positions from submitted order", () => {
    expect(
      PlaybookPhaseCollection.normalize([
        { id: "phase-2", title: "  Workout  ", position: 9 },
        { id: "phase-1", title: "Closer", position: 2 },
      ]),
    ).toEqual([
      { id: "phase-2", title: "Workout", position: 0 },
      { id: "phase-1", title: "Closer", position: 1 },
    ]);
  });

  it("rejects blank phase titles", () => {
    expect(() =>
      PlaybookPhaseCollection.normalize([{ id: "phase-1", title: "   " }]),
    ).toThrow(PlaybookPhaseValidationError);
  });
});

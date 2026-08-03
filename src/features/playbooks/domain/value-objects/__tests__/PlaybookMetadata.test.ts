import { describe, expect, it } from "vitest";
import {
  PlaybookMetadataValidationError,
  PlaybookTitle,
  PlaybookTopic,
} from "..";

describe("playbook metadata value objects", () => {
  it("normalizes title and topic whitespace", () => {
    expect(PlaybookTitle.create("  Exam review  ").value).toBe("Exam review");
    expect(PlaybookTopic.create("  Cell division  ").value).toBe(
      "Cell division",
    );
  });

  it("rejects blank required metadata", () => {
    expect(() => PlaybookTitle.create("   ")).toThrow(
      PlaybookMetadataValidationError,
    );
    expect(() => PlaybookTopic.create("\n")).toThrow(
      PlaybookMetadataValidationError,
    );
  });
});

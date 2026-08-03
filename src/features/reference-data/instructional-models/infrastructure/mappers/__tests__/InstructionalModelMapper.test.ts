import { describe, expect, it } from "vitest";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import { InstructionalModelMapper } from "../InstructionalModelMapper";

describe("InstructionalModelMapper", () => {
  it("maps the domain model without leaking domain-only fields", () => {
    const result = InstructionalModelMapper.toDTO({
      id: "model-1",
      label: "5E",
      goodFor: "Inquiry learning",
      description: "A constructivist lesson structure.",
      supportsCustomPhases: true,
      phases: [
        {
          key: "engage",
          label: "Engage",
          description: "Activate prior knowledge.",
          intent: PhaseIntent.ACTIVATE,
          position: 0,
        },
      ],
    });

    expect(result).toEqual({
      id: "model-1",
      label: "5E",
      description: "A constructivist lesson structure.",
      supportsCustomPhases: true,
      phases: [
        {
          key: "engage",
          label: "Engage",
          description: "Activate prior knowledge.",
          intentKey: "activate",
          position: 0,
        },
      ],
    });
  });
});

import { describe, expect, it } from "vitest";
import { PhaseIntent } from "../../../domain/types/PhaseIntent";
import { PhaseIntentMapper } from "../PhaseIntentMapper";

describe("PhaseIntentMapper", () => {
  it.each(Object.values(PhaseIntent))(
    "maps the stable key %s",
    (key) => {
      expect(PhaseIntentMapper.toDomain({ id: "uuid", key })).toBe(key);
    },
  );

  it("supports legacy records that stored the intent in id", () => {
    expect(PhaseIntentMapper.toDomain({ id: "reflect", key: "uuid" })).toBe(
      PhaseIntent.REFLECT,
    );
  });

  it("rejects unknown intent records", () => {
    expect(() =>
      PhaseIntentMapper.toDomain({ id: "intent-1", key: "unknown" }),
    ).toThrow("Invalid phase intent");
  });
});

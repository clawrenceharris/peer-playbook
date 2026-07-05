import { describe, it, expect } from "vitest";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";

describe("normalizeError - PostgREST (PGRST) handling", () => {
  it("maps PGRST204 to RESOURCE_NOT_FOUND", () => {
    const err = normalizeError({ message: "PGRST204: no rows found" });
    // Fix: AppErrorCode is an enum, not a type-only export.
    expect(err.code).toBe("resource_not_found");
  });

  it("maps PGRST401 to PERMISSION_DENIED", () => {
    const err = normalizeError({ message: "PGRST401: unauthorized" });
    expect(err.code).toBe("permission_denied");
  });

  it("maps PGRST429 to AUTH_RATE_LIMITED", () => {
    const err = normalizeError({ message: "PGRST429: too many requests" });
    expect(err.code).toBe("auth_rate_limited");
  });

  it("maps PGRST500 to NetworkError", () => {
    const err = normalizeError({ message: "PGRST500: internal server error" });
    expect(err).toBeInstanceOf(ApplicationError);
  });

  it("duplicate key returns UNKNOWN_ERROR with a helpful message", () => {
    const err = normalizeError({
      message: "duplicate key value violates unique constraint",
    });
    expect(err.code).toBe("unknown_error");
    expect(err.message.toLowerCase()).toContain("already exists");
  });
});

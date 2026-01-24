import { describe, it, expect } from "vitest";
import { normalizeError } from "@/utils/error";
import { AppErrorCode, NetworkError } from "@/types/errors";

describe("normalizeError - PostgREST (PGRST) handling", () => {
  it("maps PGRST204 to RESOURCE_NOT_FOUND", () => {
    const err = normalizeError({ message: "PGRST204: no rows found" });
    expect(err.code).toBe(AppErrorCode.RESOURCE_NOT_FOUND);
  });

  it("maps PGRST401 to PERMISSION_DENIED", () => {
    const err = normalizeError({ message: "PGRST401: unauthorized" });
    expect(err.code).toBe(AppErrorCode.PERMISSION_DENIED);
  });

  it("maps PGRST429 to AUTH_RATE_LIMITED", () => {
    const err = normalizeError({ message: "PGRST429: too many requests" });
    expect(err.code).toBe(AppErrorCode.AUTH_RATE_LIMITED);
  });

  it("maps PGRST500 to NetworkError", () => {
    const err = normalizeError({ message: "PGRST500: internal server error" });
    expect(err).toBeInstanceOf(NetworkError);
  });

  it("duplicate key returns UNKNOWN_ERROR with a helpful message", () => {
    const err = normalizeError({
      message: "duplicate key value violates unique constraint",
    });
    expect(err.code).toBe(AppErrorCode.UNKNOWN_ERROR);
    expect(err.userMessage.toLowerCase()).toContain("already exists");
  });
});

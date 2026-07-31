import { describe, expect, it, vi } from "vitest";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock("@/lib/openai/client", () => ({
  openai: {
    chat: {
      completions: { create },
    },
  },
}));

import { OpenAIJsonCompletionAdapter } from "../OpenAIJsonCompletionAdapter";

describe("OpenAIJsonCompletionAdapter", () => {
  it("requests JSON output and parses the provider response", async () => {
    create.mockResolvedValue({
      choices: [{ message: { content: '{"strategies":[]}' } }],
    });
    const adapter = new OpenAIJsonCompletionAdapter("test-model");

    await expect(
      adapter.completeJson({ system: "System rules", user: "Lesson details" }),
    ).resolves.toEqual({ strategies: [] });
    expect(create).toHaveBeenCalledWith({
      model: "test-model",
      messages: [
        { role: "system", content: "System rules" },
        { role: "user", content: "Lesson details" },
      ],
      response_format: { type: "json_object" },
    });
  });

  it("rejects empty and malformed provider content", async () => {
    const adapter = new OpenAIJsonCompletionAdapter("test-model");
    create.mockResolvedValue({ choices: [{ message: { content: null } }] });
    await expect(
      adapter.completeJson({ system: "System rules", user: "Lesson details" }),
    ).rejects.toThrow("empty response");

    create.mockResolvedValue({
      choices: [{ message: { content: "not json" } }],
    });
    await expect(
      adapter.completeJson({ system: "System rules", user: "Lesson details" }),
    ).rejects.toBeInstanceOf(SyntaxError);
  });
});

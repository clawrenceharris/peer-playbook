import { describe, expect, it, vi } from "vitest";
import { CreateSessionUseCase } from "../CreateSessionUseCase";

describe("CreateSessionUseCase", () => {
  it("persists the title and supports sessions without a playbook", async () => {
    const createSession = vi.fn().mockResolvedValue({ id: "session-1" });
    const useCase = new CreateSessionUseCase({ createSession } as never);

    const result = await useCase.execute({
      instructorId: "instructor-1",
      title: "Exam review",
      scheduledStart: "2026-07-21T13:00",
      mode: "in-person",
      subject: "Biology",
      topic: "Cell division",
      courseName: "Bio 101",
      description: "",
    });

    expect(result.success).toBe(true);
    expect(createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        playbookId: null,
        title: "Exam review",
      }),
    );
  });
});

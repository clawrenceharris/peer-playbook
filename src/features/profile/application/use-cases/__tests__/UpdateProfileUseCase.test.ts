import { describe, expect, it, vi } from "vitest";
import { UpdateProfileUseCase } from "../UpdateProfileUseCase";

describe("UpdateProfileUseCase", () => {
  it("does not clear an avatar when no replacement was supplied", async () => {
    const updateProfile = vi.fn().mockResolvedValue({ id: "profile-1" });
    const storage = {
      upload: vi.fn(),
      remove: vi.fn(),
    };
    const useCase = new UpdateProfileUseCase(
      { updateProfile } as never,
      storage as never,
    );

    const result = await useCase.execute({
      id: "profile-1",
      firstName: "Caleb",
      courses: ["BIO 101"],
    });

    expect(result.success).toBe(true);
    expect(updateProfile).toHaveBeenCalledWith("profile-1", {
      firstName: "Caleb",
      courses: ["BIO 101"],
    });
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it("persists the uploaded avatar URL with the profile update", async () => {
    const updateProfile = vi.fn().mockResolvedValue({ id: "profile-1" });
    const storage = {
      upload: vi.fn().mockResolvedValue({
        url: "https://example.com/avatar.png",
        path: "avatars/profile-1.png",
      }),
      remove: vi.fn(),
    };
    const useCase = new UpdateProfileUseCase(
      { updateProfile } as never,
      storage as never,
    );

    const result = await useCase.execute({
      id: "profile-1",
      avatarFile: {} as File,
    });

    expect(result.success).toBe(true);
    expect(updateProfile).toHaveBeenCalledWith("profile-1", {
      avatarUrl: "https://example.com/avatar.png",
    });
  });

  it("removes a newly uploaded avatar when the profile write fails", async () => {
    const storage = {
      upload: vi.fn().mockResolvedValue({
        url: "https://example.com/avatar.png",
        path: "avatars/profile-1.png",
      }),
      remove: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateProfileUseCase(
      { updateProfile: vi.fn().mockRejectedValue(new Error("write failed")) } as never,
      storage as never,
    );

    const result = await useCase.execute({
      id: "profile-1",
      avatarFile: {} as File,
    });

    expect(result.success).toBe(false);
    expect(storage.remove).toHaveBeenCalledWith("avatars/profile-1.png");
  });
});

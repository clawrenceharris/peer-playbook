import { logError, normalizeError } from "@/shared/utils";
import { ProfileWritePort } from "../ports";
import { UserAvatarStorage } from "../../domain/services";
import { CreateProfileInput, CreateProfileResult } from "../dto";
import { fail, ok, Result } from "@/shared/application";

export class CreateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileWritePort,
    private readonly storage: UserAvatarStorage,
  ) {}

  async execute(
    input: CreateProfileInput,
  ): Promise<Result<CreateProfileResult>> {
    const { userId, firstName, email, role, lastName, courses, avatarFile } =
      input;
    let uploadedAvatar: { path: string; url: string | null } | null = null;

    try {
      // upload avatar
      if (avatarFile) {
        uploadedAvatar = await this.storage.upload({
          userId,
          file: avatarFile,
        });
      }

      // create profile
      const profile = await this.profileRepository.createProfile({
        userId,
        firstName,
        lastName,
        courses,
        email,
        role,
        avatarUrl: uploadedAvatar?.url ?? null,
      });

      return ok({ id: profile.id });
    } catch (error) {
      if (uploadedAvatar?.path) {
        try {
          await this.storage.remove(uploadedAvatar.path);
        } catch (cleanupError) {
          logError(normalizeError(cleanupError), {
            useCase: "CreateProfileUseCase",
            operation: "removeUploadedAvatar",
          });
        }
      }
      const appError = normalizeError(error);
      logError(appError, { useCase: "CreateProfileUseCase" });
      return fail(appError);
    }
  }
}

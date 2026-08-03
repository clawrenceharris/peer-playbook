import { ProfileWritePort } from "../ports";
import { UserAvatarStorage } from "../../domain/services";
import { UpdateProfileInput } from "../dto";
import { fail, ok, Result } from "@/shared/application";
import { UpdateProfileResult } from "../dto";
import { ApplicationError, logError, normalizeError } from "@/shared/utils";
import { ActionError } from "@/shared/action";
import { UpdateProfileCommand } from "../../domain/types";

export class UpdateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileWritePort,
    private readonly storage: UserAvatarStorage,
  ) {}

  async execute(
    input: UpdateProfileInput,
  ): Promise<Result<UpdateProfileResult, ApplicationError | ActionError>> {
    const { avatarFile, id } = input;
    let uploadedAvatar: { url: string | null; path: string } | null = null;

    try {
      if (avatarFile) {
        uploadedAvatar = await this.storage.upload({
          userId: id,
          file: avatarFile,
        });
      }

      const command: UpdateProfileCommand = {
        ...(input.firstName !== undefined && { firstName: input.firstName }),
        ...(input.lastName !== undefined && { lastName: input.lastName }),
        ...(input.courses !== undefined && { courses: input.courses }),
        ...(uploadedAvatar !== null && {
          avatarUrl: uploadedAvatar?.url ?? null,
        }),
      };
      const profile = await this.profileRepository.updateProfile(id, command);
      return ok(profile);
    } catch (error) {
      const appError = normalizeError(error);
      logError(appError, { useCase: "UpdateProfileUseCase" });
      if (uploadedAvatar?.path) {
        try {
          await this.storage.remove(uploadedAvatar.path);
        } catch (cleanupError) {
          logError(normalizeError(cleanupError), {
            useCase: "UpdateProfileUseCase",
            operation: "removeUploadedAvatar",
          });
        }
      }
      return fail(appError);
    }
  }
}

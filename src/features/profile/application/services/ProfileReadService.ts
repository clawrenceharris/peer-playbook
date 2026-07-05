import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { Result, fail, ok } from "@/shared/application";
import { ProfileReadRepository } from "@/features/profile/domain/repositories";
import { ProfileCardDTO, ProfileDetailDTO } from "../dto";

export class ProfileReadService {
  constructor(private readonly profileReadRepository: ProfileReadRepository) {}

  async getProfileCard(userId: string): Promise<Result<ProfileCardDTO | null>> {
    try {
      const profile =
        await this.profileReadRepository.findProfileCardById(userId);
      return ok(profile);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
  async getProfileDetailByEmail(
    username: string,
  ): Promise<Result<ProfileDetailDTO | null>> {
    try {
      const profile =
        await this.profileReadRepository.findProfileDetailByEmail(username);
      return ok(profile);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
  async getProfileDetailById(
    userId: string,
  ): Promise<Result<ProfileDetailDTO | null, ApplicationError>> {
    try {
      const profile =
        await this.profileReadRepository.findProfileDetailById(userId);
      return ok(profile);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

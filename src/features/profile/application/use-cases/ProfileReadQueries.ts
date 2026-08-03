import { fail, ok, Result } from "@/shared/application";
import { normalizeError } from "@/shared/utils";
import { ProfileCardDTO, ProfileDetailDTO, ProfileSummaryDTO } from "../dto";
import { ProfileReadPort } from "../ports";

export class GetProfileByIdUseCase {
  constructor(private readonly profiles: ProfileReadPort) {}

  async execute(userId: string): Promise<Result<ProfileSummaryDTO | null>> {
    try {
      return ok(await this.profiles.findProfileById(userId));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

export class GetProfileDetailByIdUseCase {
  constructor(private readonly profiles: ProfileReadPort) {}

  async execute(userId: string): Promise<Result<ProfileDetailDTO | null>> {
    try {
      return ok(await this.profiles.findProfileDetailById(userId));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

export class GetProfileCardByIdUseCase {
  constructor(private readonly profiles: ProfileReadPort) {}

  async execute(userId: string): Promise<Result<ProfileCardDTO | null>> {
    try {
      return ok(await this.profiles.findProfileCardById(userId));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

export class GetProfileDetailByEmailUseCase {
  constructor(private readonly profiles: ProfileReadPort) {}

  async execute(email: string): Promise<Result<ProfileDetailDTO | null>> {
    try {
      return ok(await this.profiles.findProfileDetailByEmail(email));
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}

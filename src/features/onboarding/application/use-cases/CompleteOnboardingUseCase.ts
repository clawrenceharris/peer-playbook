import { ProfileRepository } from "@/features/profile/domain/repositories";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types/error.types";
import { CompleteOnboardingInput, CompleteOnboardingResult } from "../dto";

export class CompleteOnboardingUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(
    input: CompleteOnboardingInput,
  ): Promise<Result<CompleteOnboardingResult>> {
    const { userId, school, courses, role, dataConsentAccepted } = input;

    if (!dataConsentAccepted) {
      return fail(
        new ApplicationError({
          code: AppErrorCode.VALIDATION_FAILED,
          message: "Data consent is required to complete onboarding.",
        }),
      );
    }

    try {
      const now = new Date();
      await this.profileRepository.updateProfile(userId, {
        dataConsentAcceptedAt: now,
        onboardingCompletedAt: now,
        courses: courses,
        role: role,
        school: school,
      });

      return ok({
        userId,
        onboardingCompletedAt: now,
      });
    } catch (error) {
      console.error("Error completing onboarding", error);
      return fail(normalizeError(error));
    }
  }
}

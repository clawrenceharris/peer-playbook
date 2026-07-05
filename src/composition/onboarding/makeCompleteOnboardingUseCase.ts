import { CompleteOnboardingUseCase } from "@/features/onboarding/application/use-cases";
import { DrizzleProfileRepository } from "@/features/profile/infrastructure/repositories";
import { db } from "@/db/client";

export function makeCompleteOnboardingUseCase() {
  const profileRepository = new DrizzleProfileRepository(db);
  return new CompleteOnboardingUseCase(profileRepository);
}

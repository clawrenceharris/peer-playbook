import { CompleteOnboardingUseCase } from "@/features/onboarding/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { db } from "@/db/client";

export function makeCompleteOnboardingUseCase() {
  const profileRepository = new PrismaProfileRepository(db);
  return new CompleteOnboardingUseCase(profileRepository);
}

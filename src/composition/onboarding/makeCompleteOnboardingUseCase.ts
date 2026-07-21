import { CompleteOnboardingUseCase } from "@/features/onboarding/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { client } from "@/lib/db/client";

export function makeCompleteOnboardingUseCase() {
  const profileRepository = new PrismaProfileRepository(client);
  return new CompleteOnboardingUseCase(profileRepository);
}

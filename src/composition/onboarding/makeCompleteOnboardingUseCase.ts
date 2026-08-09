import { SupabaseAuthProvider } from "@/features/auth/infrastructure/providers";
import { CompleteOnboardingUseCase } from "@/features/onboarding/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { client } from "@/lib/db/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeCompleteOnboardingUseCase() {
  const supabase = await createServerSupabaseClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  const profileRepository = new PrismaProfileRepository(client);

  return new CompleteOnboardingUseCase(profileRepository, authProvider);
}

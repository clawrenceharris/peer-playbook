import { CreateProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { SupabaseUserAvatarStorage } from "@/features/profile/infrastructure/storage";
import { client } from "@/lib/db/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeCreateProfileUseCase() {
  const supabase = await createServerSupabaseClient();

  const profileRepository = new PrismaProfileRepository(client);
  const avatarStorage = new SupabaseUserAvatarStorage(supabase);
  return new CreateProfileUseCase(profileRepository, avatarStorage);
}

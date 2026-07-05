import { UpdateProfileUseCase } from "@/features/profile/application/use-cases";
import { DrizzleProfileRepository } from "@/features/profile/infrastructure/repositories";
import { SupabaseUserAvatarStorage } from "@/features/profile/infrastructure/storage";
import { db } from "@/db/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeUpdateProfileUseCase() {
  const profileRepository = new DrizzleProfileRepository(db);
  const supabase = await createServerSupabaseClient();
  const avatarStorage = new SupabaseUserAvatarStorage(supabase);
  return new UpdateProfileUseCase(profileRepository, avatarStorage);
}

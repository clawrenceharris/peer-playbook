import { SupabaseClient } from "@supabase/supabase-js";
import { UserAvatarStorage } from "../../domain/services/UserAvatarStorage";

const BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET ?? "profile_images";
export class SupabaseUserAvatarStorage implements UserAvatarStorage {
  constructor(private readonly supabase: SupabaseClient) {}
  async upload(input: {
    userId: string;
    file: File;
  }): Promise<{ path: string; url: string | null }> {
    const { userId, file } = input;
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/image-${Date.now()}.${extension}`;
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .upload(path, file);
    if (error) {
      throw error;
    }
    const {
      data: { publicUrl },
    } = this.supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return { path: data.path, url: publicUrl };
  }
  async remove(path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      throw error;
    }
  }
}

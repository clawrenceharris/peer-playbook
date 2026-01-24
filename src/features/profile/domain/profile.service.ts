import { normalizeError } from "@/utils/error";
import { AppErrorCode } from "@/types/errors";
import { SupabaseClient } from "@supabase/supabase-js";
import { ProfilesRepository } from "../data";
import { Profile, ProfileInsert, ProfileUpdate } from "./profile.types";

export const createProfileService = (client: SupabaseClient) => {
  const repository = new ProfilesRepository(client);

  const createProfile = async (data: ProfileInsert): Promise<Profile> => {
    try {
      return await repository.create(data);
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const getProfile = async (userId: string): Promise<Profile | null> => {
    try {
      if (!userId) {
        throw new Error(AppErrorCode.PERMISSION_DENIED);
      }

      return await repository.getById(userId);
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const updateProfile = async (
    userId: string,
    data: ProfileUpdate
  ): Promise<Profile> => {
    try {
      const updateResult = await repository.update(userId, data);
      return updateResult;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const profileExists = async (userId: string): Promise<boolean> => {
    try {
      return await repository.existsById(userId);
    } catch (error) {
      throw normalizeError(error);
    }
  };

  const deleteProfile = async (userId: string): Promise<void> => {
    try {
      await repository.delete(userId);
    } catch (error) {
      throw normalizeError(error);
    }
  };

  return {
    createProfile,
    getProfile,
    updateProfile,
    profileExists,
    deleteProfile,
    getById: getProfile,
    update: updateProfile,
    delete: deleteProfile,
  };
};

export type ProfileService = ReturnType<typeof createProfileService>;

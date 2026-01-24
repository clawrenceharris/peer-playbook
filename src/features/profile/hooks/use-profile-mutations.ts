import { useDomainMutation } from "@/lib/queries";
import { profileKeys, Profile, ProfileService, ProfileUpdate } from "../domain";
import { DefaultError } from "@tanstack/react-query";
import { useProfileService } from "./";

export const useDeleteProfile = () => {
  return useDomainMutation<ProfileService, void, DefaultError, string>(
    useProfileService,
    {
      queryKey: profileKeys.all,
      mutationKey: ["delete-profile"],
      mutationFn: (playbookService, id) => playbookService.delete(id),
    },
  );
};

export const useUpdateProfile = () => {
  return useDomainMutation<
    ProfileService,
    Profile,
    DefaultError,
    { id: string; data: ProfileUpdate }
  >(useProfileService, {
    mutationKey: ["update-profile"],
    mutationFn: (profileService, { id, data }) =>
      profileService.update(id, data),
    updater: (profiles, id) => {
      return profiles.filter((p) => p.id !== id);
    },
    invalidateFn: () => profileKeys.all,
  });
};

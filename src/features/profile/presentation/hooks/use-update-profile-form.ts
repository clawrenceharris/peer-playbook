import { useCallback } from "react";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "@/lib/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ProfileDetailDTO,
  UpdateProfileResult,
} from "../../application/dto";
import { updateProfileAction } from "@/actions/profile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileKeys } from "@/lib/queries/keys";

type UseUpdateProfileFormProps = {
  onSuccess?: (result: UpdateProfileResult) => void;
  onError?: (error: string) => void;
  profile: ProfileDetailDTO;
};
export const useUpdateProfileForm = ({
  onSuccess,
  onError,
  profile,
}: UseUpdateProfileFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName ?? "",
      courses: profile.courses ?? [],
      avatarFile: null,
    },
  });
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileFormValues) => {
      const result = await updateProfileAction({ id: profile.id, ...data });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error.message);
    },
  });
  const updateProfile = useCallback(
    async (data: UpdateProfileFormValues) => {
      return await updateProfileMutation.mutateAsync(data);
    },
    [updateProfileMutation],
  );
  return {
    form,
    isLoading: updateProfileMutation.isPending,
    updateProfile,
  };
};

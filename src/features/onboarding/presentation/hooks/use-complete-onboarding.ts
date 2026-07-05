"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboardingAction } from "@/actions/onboarding";
import { profileKeys } from "@/lib/queries/keys";
import { roleToProfileRole } from "@/features/onboarding/config";
import type { OnboardingFormValues } from "@/lib/validation";
import type { CompleteOnboardingResult } from "@/features/onboarding/application/dto";

type UseCompleteOnboardingProps = {
  userId: string;
  onSuccess?: (result: CompleteOnboardingResult) => void;
  onError?: (message: string) => void;
};

export function useCompleteOnboarding({
  userId,
  onSuccess,
  onError,
}: UseCompleteOnboardingProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["completeOnboarding", userId],
    mutationFn: async (data: OnboardingFormValues) => {
      const result = await completeOnboardingAction({
        userId,
        school: data.school ?? null,
        role: roleToProfileRole[data.role],
        courses: data.courses,
        dataConsentAccepted: data.dataConsentAccepted,
      });
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error.message);
    },
  });

  const completeOnboarding = useCallback(
    async (data: OnboardingFormValues) => {
      return await mutation.mutateAsync(data);
    },
    [mutation],
  );

  return {
    completeOnboarding,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

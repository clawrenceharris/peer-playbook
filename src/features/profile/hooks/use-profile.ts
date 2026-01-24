import { useQuery } from "@tanstack/react-query";
import { useProfileService } from "@/features/profile/hooks";

/**
 * Hook for managing user profile data with TanStack Query
 */
export function useProfile(userId?: string) {
  const profileService = useProfileService();
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const data = await profileService.getById(userId);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.message.toLowerCase().includes("not found")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

import { useCallback } from "react";
import { useUser } from "@/app/providers";
import { useSaveStrategy, useUnsaveStrategy } from "./use-strategy-mutations";

export const useStrategyActions = () => {
  const { user } = useUser();
  const { mutate: unsaveStrategy } = useUnsaveStrategy();

  const { mutate: saveStrategy } = useSaveStrategy();
  const toggleSave = useCallback(
    async (strategyId: string, isSaved: boolean) => {
      if (isSaved) {
        unsaveStrategy({ userId: user.id, strategyId });
      } else {
        saveStrategy({ userId: user.id, strategyId });
      }
    },
    [saveStrategy, unsaveStrategy, user.id]
  );

  return {
    toggleSave,
  };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useTransition } from "react";

interface UseOptimisticUpdateProps {
  initialValue: any;
  optimisticValue: any;
  updateFn: () => any;
}

export const useOptimisticUpdate = ({
  initialValue,
  optimisticValue,
  updateFn,
}: UseOptimisticUpdateProps) => {
  const [optimistic, setOptimistic] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  // Show optimistic state while mutation is pending
  const optimisticState = isPending ? optimistic : initialValue;
  const executeUpdate = () => {
    // Update optimistic state
    setOptimistic(optimisticValue);
    startTransition(() => updateFn());
  };

  return { executeUpdate, optimisticState, isPending };
};

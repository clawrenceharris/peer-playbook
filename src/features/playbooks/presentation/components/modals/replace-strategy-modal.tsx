"use client";

import { DialogContent } from "@/components/ui";
import { StrategySelectionForm } from "@/features/strategies/components";
import type { ReplaceStrategyModalProps } from "@/lib/modals/types";
import { useModal } from "@/components/providers";

export function ReplaceStrategyModal({
  strategyToReplace,
  onSubmit: onConfirm,
}: ReplaceStrategyModalProps) {
  const { closeModal } = useModal();

  return (
    <DialogContent
      title="Replace Strategy"
      description="Select a strategy to add in replacement"
      className="max-w-2xl"
    >
      <StrategySelectionForm
        onConfirm={onConfirm}
        onCancel={closeModal}
        onSuccess={closeModal}
        strategyToReplace={strategyToReplace}
      />
    </DialogContent>
  );
}

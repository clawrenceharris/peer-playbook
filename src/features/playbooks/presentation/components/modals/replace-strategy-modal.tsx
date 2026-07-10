"use client";

import { Form } from "@/components/form";
import { DialogContent } from "@/components/ui";
import { StrategySelectionForm } from "@/features/strategies/components";
import { usePendingMutations } from "@/hooks";
import type { ReplaceStrategyModalProps } from "@/lib/modals/types";
import type { Strategy } from "@/features/strategies/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
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

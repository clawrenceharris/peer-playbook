"use client";

import { useModal } from "@/app/providers";
import { Form } from "@/components/form";
import { DialogContent } from "@/components/ui";
import { StrategySelectionForm } from "@/features/strategies/components";
import { usePendingMutations } from "@/hooks";
import type { ReplaceStrategyModalProps } from "@/lib/modals/types";
import type { Strategy } from "@/features/strategies/domain";

export function ReplaceStrategyModal({
  strategyToReplace,
  onConfirm,
}: ReplaceStrategyModalProps) {
  const { closeModal } = useModal();
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["replace-playbook-strategy"],
  });
  const handleSubmit = async (data: { strategy: Strategy }) => {
    onConfirm(strategyToReplace, data.strategy);
  };

  return (
    <DialogContent
      title="Replace Strategy"
      description="Select a strategy to add in replacement"
      className="max-w-2xl"
    >
      <Form<{ strategy: Strategy }>
        onCancel={closeModal}
        onSubmit={handleSubmit}
        submitText="Replace"
        onSuccess={closeModal}
        isLoading={isLoading}
      >
        <StrategySelectionForm strategyToReplace={strategyToReplace} />
      </Form>
    </DialogContent>
  );
}

"use client";

import React, { useState } from "react";
import {
  Combobox,
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui";

import { useStrategies } from "@/features/strategies/hooks";
import { EmptyState, LoadingState } from "@/components/states";
import { StrategyCard } from ".";
import { PlaybookStrategy } from "@/features/playbooks/domain";
import { Strategy } from "@/features/strategies/domain";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { Form } from "@/components/form";
import { usePendingMutations } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface StrategySelectionFieldProps {
  strategyToReplace: PlaybookStrategy;
  onCancel?: () => void;
  onSuccess?: () => void;
  onConfirm: (strategyToReplace: PlaybookStrategy, strategy: Strategy) => void;
}
export const StrategySelectionForm = ({
  strategyToReplace,
  onCancel,
  onSuccess,
  onConfirm,
}: StrategySelectionFieldProps) => {
  const { data: strategies, isLoading: strategiesLoading } = useStrategies();
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["replace-playbook-strategy"],
  });
  const form = useForm<{ strategy: Strategy }>({
    resolver: zodResolver(z.object({ strategy: z.any() })),
    defaultValues: { strategy: strategyToReplace },
  });

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    () => {
      if (!strategies) return null;
      return (
        strategies.find(
          (strategy) => strategy.id === strategyToReplace.sourceId,
        ) ?? null
      );
    },
  );

  if (strategiesLoading) {
    return <LoadingState variant="container" />;
  }
  if (!strategies) {
    return <EmptyState />;
  }
  const handleStrategyReplace = (
    id: string,
    field: ControllerRenderProps<
      {
        strategy: Strategy;
      },
      "strategy"
    >,
  ) => {
    if (id === strategyToReplace.id) return;
    const strategy = strategies.find((strategy) => strategy.id === id);
    if (!strategy) return;
    setSelectedStrategy(strategy);
    field.onChange(strategy);
  };

  return (
    <Form<{ strategy: Strategy }>
      form={form}
      enableBeforeUnloadProtection={false}
      onCancel={onCancel}
      handleSubmit={async (data) => {
        await onConfirm(strategyToReplace, data.strategy);
        onSuccess?.();
      }}
      submitText="Replace"
      isLoading={isLoading}
      isDialog
    >
      {({ control }) => (
        <FieldGroup>
          <Controller
            control={control}
            name="strategy"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Add Strategy</FieldLabel>
                <FieldContent>
                  <Combobox
                    value={field.value.id}
                    items={strategies.map((item) => ({
                      value: item.id,
                      label: item.title,
                    }))}
                    // placeholder="Select a Strategy"
                    onValueChange={(value) => {
                      handleStrategyReplace(value ?? "", field);
                    }}
                  />
                  <FieldError errors={[fieldState.error]} />
                </FieldContent>
              </Field>
            )}
          />

          {selectedStrategy && (
            <HoverCard>
              <HoverCardTrigger>
                <StrategyCard
                  strategy={selectedStrategy}
                  showsSteps={false}
                  headerClassName="rounded-xl"
                  phase={strategyToReplace.phase}
                  showActionButtons={false}
                />
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                className="w-[400px] rounded-2xl p-0"
                align="center"
              >
                <StrategyCard
                  headerClassName="hidden"
                  showActionButtons={false}
                  phase={strategyToReplace.phase}
                  strategy={selectedStrategy}
                />
              </HoverCardContent>
            </HoverCard>
          )}
        </FieldGroup>
      )}
    </Form>
  );
};

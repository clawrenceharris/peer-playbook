"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Toggle,
} from "@/components/ui";
import { EmptyState, LoadingState } from "@/components/states";
import { Plus, RefreshCw, X } from "lucide-react";
import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { usePlaybookContexts } from "@/features/playbooks/hooks/use-playbook-contexts";

export function ContextsSection<T extends FieldValues>() {
  const { control } = useFormContext<T>();
  const [contextCardOpen, setContextCardOpen] = useState(false);
  const {
    toggleContext,
    selectedContextKeys,
    contexts,
    isLoading: contextsLoading,
    refetchContexts,
    isRefetching,
    isError,
  } = usePlaybookContexts();

  const remainingContexts = useMemo(
    () =>
      Object.values(contexts).filter((c) => !selectedContextKeys.includes(c.key)),
    [contexts, selectedContextKeys],
  );

  return (
    <Controller
      name={"contexts" as any}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldContent>
            <FieldLabel>
              Context
              <span className="text-muted-foreground text-sm font-normal">
                (Optional)
              </span>
            </FieldLabel>
            <FieldDescription className="text-muted-foreground font-normal text-sm">
              Add context tags to generate a more targeted playbook for your
              session.
            </FieldDescription>
          </FieldContent>
          <FieldContent>
            <Popover open={contextCardOpen} onOpenChange={setContextCardOpen}>
              <div className="row flex-wrap">
                <PopoverTrigger className="max-w-40" asChild>
                  <Button type="button" variant="outline">
                    <Plus />
                    Add Context
                  </Button>
                </PopoverTrigger>

                {(selectedContextKeys ?? []).map((key) => (
                  <Toggle
                    onPressedChange={() => {
                      field.onChange(
                        (field.value ?? []).filter((k: string) => k !== key),
                      );
                      toggleContext(key);
                    }}
                    variant={"outline"}
                    key={key}
                    size={"lg"}
                    pressed={true}
                  >
                    {contexts[key]?.label ?? key}
                    <X className="text-muted-foreground" />
                  </Toggle>
                ))}
              </div>
              <PopoverContent
                align="start"
                side="top"
                className="w-130 p-6 flex gap-4 max-h-70 overflow-auto flex-wrap "
              >
                {contextsLoading || isRefetching ? (
                  <LoadingState size={20} variant="container" />
                ) : isError || remainingContexts.length === 0 ? (
                  <EmptyState
                    variant="item"
                    itemVariant="outline"
                    title={
                      isError ? "Failed to load contexts" : "No contexts available"
                    }
                    message={
                      isError
                        ? "Unable to load contexts. You can still create a playbook without them."
                        : "No session contexts are currently available."
                    }
                    actionLabel="Retry"
                    onAction={() => refetchContexts()}
                    icon={
                      isError ? (
                        <RefreshCw className="w-8 h-8 text-muted-foreground" />
                      ) : undefined
                    }
                  />
                ) : (
                  remainingContexts.map((context) => (
                    <Toggle
                      variant={"outline"}
                      key={context.id}
                      disabled={(field.value ?? []).includes(context.key)}
                      size={"lg"}
                      pressed={false}
                      onPressedChange={() => {
                        field.onChange([...(field.value ?? []), context.key]);
                        toggleContext(context.key);
                      }}
                    >
                      {context.label}
                    </Toggle>
                  ))
                )}
              </PopoverContent>
            </Popover>
          </FieldContent>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}


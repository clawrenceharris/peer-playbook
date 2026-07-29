"use client";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui";
import { Controller, useFormContext } from "react-hook-form";
import { SessionContextDTO } from "@/features/playbooks/application/dto";
import { ComboboxMultiple } from "@/components/ui/combobox-multiple";

export function ContextsSection({
  contexts,
}: {
  contexts: SessionContextDTO[];
}) {
  const { control } = useFormContext<{ contexts: string[] }>();

  return (
    <Controller
      name="contexts"
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
            <FieldDescription className="text-muted-foreground text-sm font-normal">
              Add context tags to generate a more targeted playbook for your
              session.
            </FieldDescription>
          </FieldContent>

          <ComboboxMultiple
            onValueChange={field.onChange}
            placeholder="Add contexts"
            emptyMessage="No contexts found."
            items={contexts.map((context) => context.context)}
          />
          {/* <FieldContent>
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
                        (field.value ?? []).filter((k: string) => k !== key)
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
                      isError
                        ? "Failed to load contexts"
                        : "No contexts available"
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
          </FieldContent> */}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

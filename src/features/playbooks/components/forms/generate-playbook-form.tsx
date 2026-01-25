"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Toggle,
} from "@/components/ui";
import { GeneratePlaybookFormValues, generatePlaybookSchema } from "@/features/playbooks/domain";
import { EmptyState, LoadingState } from "@/components/states";
import { Plus, X, RefreshCw } from "lucide-react";
import { usePlaybookContexts } from "../../hooks";
import { Enums } from "@/types";
import { Controller, useFormContext } from "react-hook-form";
import { Form, FormLayoutProps, InputField, TextareaField } from "@/components/form";
import { SelectIcon } from "@radix-ui/react-select";
import { subjects } from "@/lib/constants";
import { SelectField } from "@/components/form/select-field";
import { ComboboxField } from "@/components/form/combobox-field";
import { zodResolver } from "@hookform/resolvers/zod";

export function GeneratePlaybookForm({...props} : FormLayoutProps<GeneratePlaybookFormValues>) {
  const { control } = useFormContext<GeneratePlaybookFormValues>();
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
      Object.values(contexts).filter(
        (c) => !selectedContextKeys.includes(c.key),
      ),
    [contexts, selectedContextKeys],
  );
  return (
    <Form<GeneratePlaybookFormValues>
      id="form-generate-playbook"
      description="Describe your lesson below to build a Playbook composed of SI strategies."
      resolver={zodResolver(generatePlaybookSchema)}
      {...props}  
    >
      <FieldSet className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
        <FieldLegend className="sr-only">Lesson Details</FieldLegend>
        <ComboboxField<GeneratePlaybookFormValues>
          name="subject"
          label="Subject"
          placeholder="Subject"
          defaultValue=""
          items={Object.keys(subjects).map((s) => ({
            label: s,
            value: s,
            icon: subjects[s],
          }))}
        />

        <InputField<GeneratePlaybookFormValues>
          name="courseName"
          label={"Course"}
          defaultValue=""
          placeholder="Course"
        />

        <InputField<GeneratePlaybookFormValues>
          name="topic"
          label={"Topic"}
          placeholder="Topic"
          defaultValue=""
        />
      </FieldSet>
      <TextareaField<GeneratePlaybookFormValues>
        name="instructions"
        defaultValue=""
        placeholder="Add instructions or more details here: Describe the lesson topic, expected group size, or specific requirements."
        label={"Instructions"}
        isOptional
      />

      <Controller
        name="contexts"
        control={control}
        defaultValue={[]}
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
                  {selectedContextKeys.map((key) => (
                    <Toggle
                      onPressedChange={() => {
                        field.onChange(
                          field.value.filter((k: string) => k !== key),
                        );
                        toggleContext(key);
                      }}
                      variant={"outline"}
                      key={key}
                      size={"lg"}
                      pressed={true}
                    >
                      {contexts[key].label}
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
                        disabled={field.value.includes(context.key)}
                        size={"lg"}
                        pressed={false}
                        onPressedChange={() => {
                          field.onChange([...field.value, context.key]);
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

      <Controller
        name="modes"
        control={control}
        defaultValue={[]}
        render={({ field, fieldState }) => (
          <FieldSet>
            <FieldLegend className="sr-only" variant="label">
              Session Details
            </FieldLegend>
            <FieldLabel>
              Modes
              <span className="text-muted-foreground text-sm font-normal">
                (Optional)
              </span>
            </FieldLabel>

            <FieldDescription>
              What classroom format should this playbook be designed for?
              (Select all that apply)
            </FieldDescription>
            <FieldGroup data-slot="checkbox-group">
              {(
                ["in-person", "virtual", "hybrid"] as Enums<"session_mode">[]
              ).map((mode) => (
                <Field key={mode} orientation="horizontal">
                  <Checkbox
                    id={`form-rhf-checkbox-${mode}`}
                    name={field.name}
                    aria-invalid={fieldState.invalid}
                    checked={field.value.includes(mode)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, mode]
                        : field.value.filter((value) => value !== mode);
                      field.onChange(newValue);
                    }}
                  />
                  <FieldLabel
                    htmlFor={`form-rhf-checkbox-${mode}`}
                    className="font-normal capitalize"
                  >
                    {mode}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>
        )}
      />
    </Form>
  );
}

"use client";

import * as React from "react";

import type { PlateElementProps } from "platejs/react";

import { PlateElement } from "platejs/react";
import { Plus, Trash2 } from "lucide-react";

import {
  Button,
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export type StrategyHeaderPhase = "warmup" | "workout" | "closer";

export type StrategyHeaderElementType = {
  type: "strategyHeader";
  title?: string;
  phase?: StrategyHeaderPhase;
  steps?: string[];
  // Slate requires children even for void-ish elements
  children: { text: string }[];
};

const phaseOptions: StrategyHeaderPhase[] = ["warmup", "workout", "closer"];

export function StrategyHeaderElement(
  props: PlateElementProps<StrategyHeaderElementType>,
) {
  const { editor, element } = props;

  const title = element.title ?? "";
  const phase = element.phase ?? "warmup";
  const steps = element.steps ?? [];

  const setNode = React.useCallback(
    (
      patch: Partial<
        Pick<StrategyHeaderElementType, "title" | "phase" | "steps">
      >,
    ) => {
      editor.tf.setNodes(patch, { at: element });
    },
    [editor.tf, element],
  );

  const handleStepChange = (index: number, value: string) => {
    const next = [...steps];
    next[index] = value;
    setNode({ steps: next });
  };

  const handleRemoveStep = (index: number) => {
    setNode({ steps: steps.filter((_, i) => i !== index) });
  };

  const handleAddStep = () => {
    setNode({ steps: [...steps, ""] });
  };
  const inputClassName =
    "w-full border-0 px-5 rounded-none focus:ring-0 border-b-muted-foreground/30 focus:border-b-primary-400 bg-secondary-foreground/60 border-b-3 shadow-none";
  return (
    <PlateElement
      {...props}
      className={cn("my-3 rounded-xl w-full p-3")}
      attributes={{
        ...props.attributes,
        contentEditable: false,
        "data-strategy-header": "true",
      }}
    >
      <FieldGroup>
        <Field>
          <FieldContent>
            <FieldLabel className="sr-only">Title</FieldLabel>

            <span className="text-sm text-muted-foreground capitalize">
              {phase}
            </span>
            <Input
              className={cn(inputClassName, "h-13")}
              value={title}
              onChange={(e) => setNode({ title: e.target.value })}
              placeholder="Title"
            />
          </FieldContent>
        </Field>

        <div className="space-y-3">
          <FieldSet>
            <FieldLabel className="sr-only">Steps</FieldLabel>
            {steps.map((step, index) => (
              <Field orientation="horizontal" key={`step-${index}`}>
                <FieldContent className="flex flex-row items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {index + 1}.
                  </span>
                  <Input
                    value={step}
                    onChange={(event) =>
                      handleStepChange(index, event.target.value)
                    }
                    placeholder={`Step ${index + 1}`}
                    className={inputClassName}
                  />
                </FieldContent>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  aria-label="Remove step"
                >
                  <Trash2 />
                </Button>
              </Field>
            ))}
          </FieldSet>
          <Button
            variant="muted"
            size="icon"
            type="button"
            onClick={handleAddStep}
          >
            <Plus />
          </Button>
        </div>

        {props.children}
      </FieldGroup>
    </PlateElement>
  );
}

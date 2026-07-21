import { Icon } from "@/components/shared";
import { Item, ItemActions, ItemContent } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import { assets } from "@/lib/constants";
import clsx from "clsx";
import {
  Check,
  Loader2,
  LucideProps,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";

/**
 * Draft fields are the source of truth while editing.
 * Binding inputs to strategy.* (server snapshot) makes controlled inputs appear "stuck".
 */
type StrategyDraft = {
  title: string;
  steps: string[];
  facilitatorNotes: string;
  estimatedMinutes: string;
};

type StrategyDetailsProps = {
  strategy: {
    id: string;
    title: string;
    steps: string[];
    facilitatorNotes: string | null;
    estimatedMinutes: number | null;
    phase: {
      id: string;
      title: string;
      intent: PhaseIntent;
      position: number;
      estimatedMinutes: number | null;
      Icon: React.ComponentType<LucideProps>;
    };
  } | null;
  draft: StrategyDraft | null;
  isDirty: boolean;
  isSaving: boolean;
  errorMessage?: string | null;
  onStepChange: (stepIndex: number, value: string) => void;
  onStepRemove: (stepIndex: number) => void;
  onAddStep: () => void;
  onTitleChange: (value: string) => void;
  onFacilitatorNotesChange: (value: string) => void;
  onEstimatedMinutesChange: (value: string) => void;
  onReset: () => void;
  onSave: () => void;
};

export function StrategyDetails({
  strategy,
  draft,
  isDirty,
  isSaving,
  errorMessage,
  onStepChange,
  onStepRemove,
  onAddStep,
  onTitleChange,
  onFacilitatorNotesChange,
  onEstimatedMinutesChange,
  onReset,
  onSave,
}: StrategyDetailsProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  if (!strategy)
    return (
      <div className="text-muted-foreground flex h-full flex-1 items-center justify-center rounded-lg border border-dashed text-sm">
        No strategies yet for this phase.
      </div>
    );

  const displayTitle = draft?.title ?? strategy.title;
  const displayMinutes =
    draft?.estimatedMinutes !== undefined && draft.estimatedMinutes !== ""
      ? draft.estimatedMinutes
      : strategy.estimatedMinutes != null
        ? String(strategy.estimatedMinutes)
        : "0";

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <Item className="bg-surface rounded-lg border shadow-xs">
        <ItemContent>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground mt-1 text-sm">
              {strategy.phase.title}
            </p>
            <div>
              <div className="flex items-center gap-3">
                {isEditingTitle ? (
                  <Input
                    className="w-fit rounded-md focus-visible:ring-0"
                    aria-label={`${displayTitle} strategy title`}
                    // Bind to draft so keystrokes update the controlled input.
                    value={draft?.title ?? ""}
                    onChange={(event) => onTitleChange(event.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <CardTitle>
                      <h2 className="text-foreground text-2xl font-bold">
                        {displayTitle}{" "}
                        <span className="text-muted-foreground text-sm">
                          ({displayMinutes} min)
                        </span>
                      </h2>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      <Icon
                        src={assets.pencilEdit}
                        className="opacity-50"
                        alt="Edit"
                      />
                      <span className="sr-only">Edit strategy title</span>
                    </Button>
                  </div>
                )}

                {isEditingTitle ? (
                  <InputGroup className="w-32 rounded-md">
                    <InputGroupInput
                      aria-label={`${displayTitle} strategy duration in minutes`}
                      type="number"
                      min={0}
                      // String draft value is required for empty intermediate input states.
                      value={draft?.estimatedMinutes ?? ""}
                      onChange={(event) =>
                        onEstimatedMinutesChange(event.target.value)
                      }
                    />
                    <InputGroupAddon
                      align="inline-end"
                      className="text-muted-foreground text-sm"
                    >
                      min
                    </InputGroupAddon>
                  </InputGroup>
                ) : null}
                {isEditingTitle ? (
                  <Button
                    onClick={() => setIsEditingTitle(false)}
                    variant="ghost"
                    className="text-primary"
                    size="icon-sm"
                  >
                    <Check strokeWidth={3} className="size-5" />
                    <span className="sr-only">Done editing title</span>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </ItemContent>
        <ItemActions className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={!isDirty || isSaving}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={onSave}

            disabled={!isDirty || isSaving}
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </ItemActions>
      </Item>
      <Card className="bg-surface min-h-0 rounded-lg border shadow-xs">
        <CardContent className="flex h-full w-full flex-col gap-4 overflow-y-auto px-5 py-6">
          <section className="w-full flex-1 space-y-4">
            <h3 className="text-foreground text-lg font-semibold">Steps</h3>
            <ol className="text-foreground/80 space-y-4">
              {(draft?.steps ?? []).map((step, i) => (
                <li className="flex items-center gap-1" key={i}>
                  <div
                    className={`flex size-7 items-center justify-center rounded-full ${clsx(
                      {
                        "text-intent-activate bg-intent-activate/10":
                          strategy.phase.intent === PhaseIntent.ACTIVATE,
                        "text-intent-apply bg-intent-apply/10":
                          strategy.phase.intent === PhaseIntent.APPLY,
                        "text-intent-reflect bg-intent-reflect/10":
                          strategy.phase.intent === PhaseIntent.REFLECT,
                        "text-intent-explore bg-intent-explore/10":
                          strategy.phase.intent === PhaseIntent.EXPLORE,
                        "text-intent-transition bg-intent-transition/10":
                          strategy.phase.intent === PhaseIntent.TRANSITION,
                      },
                    )}`}
                  >
                    <span>{i + 1}</span>
                  </div>
                  <Textarea
                    className="min-h-14 flex-1 rounded-md"
                    value={step}
                    onChange={(event) => onStepChange(i, event.target.value)}
                  />
                  <Button
                    size="icon-sm"
                    variant="destructive"
                    onClick={() => onStepRemove(i)}
                    aria-label={`Remove step ${i + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ol>
            <Button variant="outline" onClick={onAddStep}>
              <Plus className="size-4" /> Add Step
            </Button>
          </section>
          <Separator />
          <section className="flex-1 space-y-4">
            <h3 className="text-foreground text-lg font-semibold">
              Facilitator Notes
            </h3>
            <Textarea
              className="min-h-32"
              placeholder="Add guidance, reminders, or facilitation cues for this strategy."
              value={draft?.facilitatorNotes ?? ""}
              onChange={(event) => onFacilitatorNotesChange(event.target.value)}
            />
          </section>
        </CardContent>
        {errorMessage ? (
          <p className="text-destructive text-sm">{errorMessage}</p>
        ) : null}
      </Card>
    </div>
  );
}

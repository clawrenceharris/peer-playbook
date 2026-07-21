"use client";

import { Check } from "lucide-react";
import { Icon } from "@/components/icons/icon";
import {
  Button,
  Input,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Item,
  ItemContent,
  ItemActions,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { assets } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PHASE_STYLES } from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";
import { type PlaybookWorkspacePhase } from "../../workspace";
import { phaseIntentCatalog } from "@/features/reference-data/phase-intents/infrastructure/catalogs/phase-intent";

type PlaybookPhaseHeaderProps = {
  activePhase: PlaybookWorkspacePhase;
  isEditingPhase: boolean;
  workspaceError: string | null;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onTitleChange: (value: string) => void;
  onEstimatedMinutesChange: (value: number | null) => void;
  onPhaseIntentChange: (
    phaseId: string,
    value: "activate" | "explore" | "apply" | "reflect",
  ) => void;
};

export function PlaybookPhaseHeader({
  activePhase,
  isEditingPhase,
  workspaceError,
  onStartEditing,
  onStopEditing,
  onTitleChange,
  onEstimatedMinutesChange,
  onPhaseIntentChange,
}: PlaybookPhaseHeaderProps) {
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onStopEditing();
  }
  return (
    <Item variant="outline" className="bg-surface shadow-xs">
      {!isEditingPhase ? (
        <ItemMedia
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            PHASE_STYLES[activePhase.intent].icon,
          )}
          variant="icon"
        >
          <activePhase.Icon strokeWidth={2.5} className="size-4.5" />
        </ItemMedia>
      ) : null}
      <ItemContent>
        {!isEditingPhase ? (
          <div className="flex items-center gap-2">
            <ItemTitle className="line-clamp-1 w-full max-w-full truncate text-xl font-bold">
              {activePhase.title}{" "}
              <span className="text-muted-foreground text-sm">
                ({activePhase.estimatedMinutes ?? 0} min)
              </span>
            </ItemTitle>
          </div>
        ) : null}
        {isEditingPhase ? (
          <form
            className="flex flex-wrap items-center gap-3"
            onSubmit={handleSubmit}
          >
            <Select
              value={activePhase.intent}
              onValueChange={(value) => {
                onPhaseIntentChange(
                  activePhase.id,
                  value as "activate" | "explore" | "apply" | "reflect",
                );
              }}
            >
              <SelectTrigger
                triggerClassName={cn(
                  PHASE_STYLES[activePhase.intent].icon,
                  "bg-transparent",
                )}
                className={cn(
                  "flex items-center justify-center border-0 border-none bg-transparent shadow-none",
                  PHASE_STYLES[activePhase.intent].icon,
                )}
              >
                <SelectValue>
                  <activePhase.Icon
                    strokeWidth={2.5}
                    className={cn(
                      "size-4.5",
                      PHASE_STYLES[activePhase.intent].icon,
                      "bg-transparent",
                    )}
                  />
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom" align="end">
                {phaseIntentCatalog.map((intent) => (
                  <SelectItem key={intent.key} value={intent.key}>
                    <intent.Icon className="size-4" />
                    <span>{intent.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              id={`${activePhase.id}-phase-title`}
              className="w-fit rounded-md focus-visible:ring-0"
              aria-label={`${activePhase.title} phase title`}
              value={activePhase.title}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => onTitleChange(event.target.value)}
            />
            <InputGroup className="w-32 rounded-md">
              <InputGroupInput
                id={`${activePhase.id}-phase-duration`}
                aria-label={`${activePhase.title} phase duration in minutes`}
                type="number"
                min={0}
                value={activePhase.estimatedMinutes ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  // Keep empty string as null; reject NaN so the controlled input stays usable.
                  if (value === "") {
                    onEstimatedMinutesChange(null);
                    return;
                  }
                  const next = Number(value);
                  onEstimatedMinutesChange(Number.isFinite(next) ? next : null);
                }}
              />
              <InputGroupAddon
                align="inline-end"
                className="text-muted-foreground text-sm"
              >
                min
              </InputGroupAddon>
            </InputGroup>
            <Button
              type="submit"
              onClick={onStopEditing}
              variant="ghost"
              className="text-primary"
              size="icon-sm"
            >
              <Check strokeWidth={3} className="size-5" />
              <span className="sr-only">Save phase</span>
            </Button>
          </form>
        ) : null}
      </ItemContent>
      {!isEditingPhase ? (
        <ItemActions>
          <Button variant="ghost" size="icon-sm" onClick={onStartEditing}>
            <Icon src={assets.pencilEdit} className="opacity-50" alt="Edit" />
            <span className="sr-only">Edit phase title</span>
          </Button>
        </ItemActions>
      ) : null}
      {workspaceError ? (
        <p className="text-destructive mt-2 text-sm">{workspaceError}</p>
      ) : null}
    </Item>
  );
}

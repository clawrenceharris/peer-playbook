"use client";

import {
  Check,
  CheckCircle,
  EllipsisVertical,
  Plus,
  Printer,
  Share,
  StarIcon,
  Trash2,
  Loader2,
} from "lucide-react";
import { Playbook } from "@/components/icons";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { cn, timeAgo } from "@/lib/utils";
import type { GetPlaybookPageOutput } from "@/features/playbooks/application/dto";
import type { PlaybookWorkspaceMetadataItem } from "../../workspace";

type PlaybookWorkspaceHeaderProps = {
  playbook: GetPlaybookPageOutput["playbook"];
  metadata: PlaybookWorkspaceMetadataItem[];
  hasSession: boolean;
  isFavorite: boolean;
  isFavoriting: boolean;
  isUnfavoriting: boolean;
  canSaveWorkspace: boolean;
  isSavingWorkspace: boolean;
  onCreateSession: () => void;
  onSaveWorkspace: () => void;
  onToggleFavorite: () => void | Promise<void>;
  onDeletePlaybook: () => void;
};

export function PlaybookWorkspaceHeader({
  playbook,
  metadata,
  hasSession,
  isFavorite,
  isFavoriting,
  isUnfavoriting,
  canSaveWorkspace,
  isSavingWorkspace,
  onCreateSession,
  onSaveWorkspace,
  onToggleFavorite,
  onDeletePlaybook,
}: PlaybookWorkspaceHeaderProps) {
  return (
    <Item
      className={cn(
        "group/scenario-card relative w-full overflow-hidden rounded-lg border-0 shadow-none transition-all",
      )}
    >
      <ItemMedia
        variant="icon"
        className="[&_path]:stroke-muted-foreground bg-primary-foreground flex size-18 items-center justify-center rounded-sm border"
      >
        <Playbook className="transition-all duration-200 group-hover:scale-[1.2]" />
      </ItemMedia>
      <ItemContent>
        <div className="flex items-center gap-2">
          <ItemTitle
            className={cn(
              "text-lg font-semibold",
              "line-clamp-1 truncate text-lg font-semibold",
            )}
          >
            <h1 className="text-xl font-bold">{playbook.title}</h1>
          </ItemTitle>

          <span className="text-muted-foreground text-sm">
            {playbook.createdAt
              ? timeAgo(playbook.createdAt.toISOString())
              : ""}
          </span>

          {hasSession ? (
            <span className="text-success-500 bg-success-100 flex items-center gap-1 rounded-full py-1 pr-2 pl-1 text-xs">
              <Check
                size={15}
                className="bg-success-500 rounded-full border-white p-0.5 text-white"
              />
              Session Created
            </span>
          ) : null}
          {isFavorite ? (
            <StarIcon className="[svg]:stroke-star [svg]:fill-star size-4" />
          ) : null}
        </div>
        <ItemDescription className="text-xs">
          <span className="text-muted-foreground text-sm font-normal">
            {playbook.topic}
          </span>
          {metadata.map((item, index) => (
            <span
              key={`${item.label}-${item.value}-${index}`}
              className="text-muted-foreground text-sm font-normal"
            >
              {index > 0 ? " • " : " • "} {item.label} {item.value}
            </span>
          ))}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          className="bg-surface"
          onClick={onCreateSession}
        >
          <Plus strokeWidth={3} /> Create Session
        </Button>
        <Button
          variant="primary"
          disabled={!canSaveWorkspace || isSavingWorkspace}
          onClick={onSaveWorkspace}
        >
          {isSavingWorkspace ? (
            <Loader2 className="animate-spin" />
          ) : (
            <CheckCircle />
          )}
          {isSavingWorkspace ? "Saving..." : "Save"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={onToggleFavorite}
              disabled={isFavoriting || isUnfavoriting}
            >
              <StarIcon
                className={
                  isFavorite ? "[svg]:stroke-star [svg]:fill-star" : ""
                }
              />
              {isFavorite ? "Unfavorite" : "Favorite"}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Share />
              Publish
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Printer />
              Print
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDeletePlaybook}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
}

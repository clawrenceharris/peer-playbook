import { Delete } from "@/components/icons";
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
  ItemHeader,
  ItemTitle,
} from "@/components/ui";
import { Check, Loader2, MoreVertical, StarIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  useAddFavoritePlaybook,
  useDeletePlaybook,
  useMyFavoritePlaybooks,
  useRemoveFavoritePlaybook,
} from "@/features/playbooks/presentation/hooks";
import { cn, timeAgo } from "@/lib/utils";
import { usePlaybookSessions } from "@/features/sessions/hooks";
import { useUser } from "@/components/providers";
import { useRouter } from "next/navigation";
import { useModals } from "@/hooks";
import { Icon } from "@/components/shared";
import { assets } from "@/lib/constants";

interface PlaybookCardProps {
  playbook: {
    id: string;
    title: string;
    topic: string;
    courseName: string | null;
    creator: {
      id: string;
      displayName: string;
      avatarUrl: string | null;
    };
    createdAt: Date;
  };
  onNavigate?: () => void;
  canEdit?: boolean;
  className?: string;
}

export const PlaybookCard = ({
  playbook,
  onNavigate,
  canEdit = false,
  className,
}: PlaybookCardProps) => {
  const { data: playbooks = [] } = usePlaybookSessions(playbook.id);
  const hasSession = useMemo(
    () => playbooks.some((p) => p.id === playbook.id),
    [playbook.id, playbooks],
  );
  const { user } = useUser();

  const { mutateAsync: favoritePlaybook, isPending: isFavoriting } =
    useAddFavoritePlaybook();
  const {
    modals: { confirmation: confirmationModal },
  } = useModals();
  const { mutateAsync: unfavoritePlaybook, isPending: isUnfavoriting } =
    useRemoveFavoritePlaybook();
  const { mutate, isPending: isDeleting } = useDeletePlaybook();
  const [isHovering, setIsHovering] = useState(false);
  const { data: favoritePlaybooks = [] } = useMyFavoritePlaybooks(user.id);
  const favorite = useMemo(
    () => favoritePlaybooks.includes(playbook.id),
    [favoritePlaybooks, playbook.id],
  );
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(favorite);
  function handleDeletePlaybook(e: React.MouseEvent) {
    e.stopPropagation();
    confirmationModal.open({
      title: "Delete Playbook",
      description: "Are you sure you want to delete this playbook?",
      onConfirm: () => mutate(playbook.id),
    });
  }
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      setIsFavorite(false);
      unfavoritePlaybook({ playbookId: playbook.id, userId: user.id });
    } else {
      setIsFavorite(true);
      favoritePlaybook({ playbookId: playbook.id, userId: user.id });
    }
  };
  return (
    <Item
      className={cn(
        "bg-card relative w-full min-w-[330px] cursor-pointer overflow-hidden rounded-md",
        className,
      )}
      variant="outline"
      tabIndex={0}
      aria-label={`View playbook: ${playbook.title}`}
      onClick={onNavigate}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span
        aria-hidden
        className={cn(
          "bg-primary-300/80 absolute bottom-0 left-0 h-[5px] w-full opacity-0",
          isHovering && "opacity-100",
        )}
      />
      <ItemHeader>
        <div className="flex items-center gap-2">
          <ItemTitle
            className={cn(
              "text-lg font-semibold",
              "line-clamp-1 flex-1 truncate text-lg font-semibold",
            )}
          >
            {playbook.title}
          </ItemTitle>

          <span className="text-muted-foreground text-sm">
            {playbook.createdAt
              ? timeAgo(playbook.createdAt?.toISOString())
              : ""}
          </span>

          {hasSession && (
            <span className="text-success-500 bg-success-100 flex items-center gap-1 rounded-full py-1 pr-2 pl-1 text-xs">
              <Check
                size={15}
                className="bg-success-500 rounded-full border-white p-0.5 text-white"
              />
              Session Created
            </span>
          )}
          {isFavorite && (
            <StarIcon className="[svg]:stroke-star [svg]:fill-star size-4" />
          )}
        </div>
      </ItemHeader>
      <ItemContent>
        <ItemDescription className="spa text-sm">
          {`${playbook.topic}${playbook.courseName ? ` - ${playbook.courseName}` : ""}`}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex items-center gap-2">
        {canEdit && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/playbooks/${playbook.id}`);
            }}
            className="bg-primary-foreground border shadow-sm"
            variant="outline"
          >
            <Icon src={assets.pencilEdit} alt="Edit" />
            Edit
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onFocus={() => setIsHovering(false)}
              onClick={(e) => e.stopPropagation()}
              variant="ghost"
              size="icon"
            >
              {isDeleting ? (
                <Loader2 strokeWidth={2.5} className="size-4 animate-spin" />
              ) : (
                <MoreVertical />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onMouseEnter={() => setIsHovering(false)}>
            <DropdownMenuItem
              onClick={handleFavoriteClick}
              disabled={isFavoriting || isUnfavoriting}
            >
              <StarIcon
                className={
                  isFavorite ? "[svg]:stroke-star [svg]:fill-star" : ""
                }
              />
              {isFavorite ? "Unfavorite" : "Favorite"}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDeletePlaybook}
            >
              <Delete /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
};

import {
  Delete,
  PencilEdit,
  Playbook as PlaybookIcon,
} from "@/components/icons";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Item,
  ItemActions,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { Check, MoreVertical, StarIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  useAddFavoritePlaybook,
  useMyFavoritePlaybooks,
  usePlaybookActions,
  usePlaybookSortedStrategies,
  useRemoveFavoritePlaybook,
} from "@/features/playbooks/hooks";
import { cn, timeAgo } from "@/lib/utils";
import { StrategyCard } from "@/features/strategies/components";
import { usePlaybookSessions } from "@/features/sessions/hooks";
import { useUser } from "@/app/providers";
import { Playbook } from "@/features/playbooks/domain";
import { useRouter } from "next/navigation";

interface PlaybookCardProps {
  playbook: Playbook;
  onNavigate?: () => void;
  canEdit?: boolean;
  className?: string;
  titleTextClassName?: string;
  hoverDisabled?: boolean;
}

export const PlaybookCard = ({
  playbook,
  onNavigate,
  canEdit = false,
  hoverDisabled = false,
  className,
  titleTextClassName,
}: PlaybookCardProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data: strategies = [] } = usePlaybookSortedStrategies(playbook.id);
  const { data: playbooks = [] } = usePlaybookSessions(playbook.id);
  const hasSession = useMemo(
    () => playbooks.some((p) => p.id === playbook.id),
    [playbook.id, playbooks],
  );
  const { user } = useUser();

  const { deletePlaybook } = usePlaybookActions();
  const { mutateAsync: favoritePlaybook, isPending: isFavoriting } =
    useAddFavoritePlaybook();
  const { mutateAsync: unfavoritePlaybook, isPending: isUnfavoriting } =
    useRemoveFavoritePlaybook();
  const { data: favoritePlaybooks = [] } = useMyFavoritePlaybooks(user.id);
  const favorite = useMemo(
    () => favoritePlaybooks.includes(playbook.id),
    [favoritePlaybooks, playbook.id],
  );
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(favorite);

  const handleFavorite = async (e: React.MouseEvent) => {
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
    <>
      <HoverCard
        open={!hoverDisabled && previewOpen}
        onOpenChange={setPreviewOpen}
      >
        <Item
          onClick={onNavigate}
          key={playbook.id}
          className={cn(
            "group w-full p-5 shadow-sm rounded-md border-l-10 border-l-primary-400 flex-col max-w-4xl bg-primary-foreground justify-center cursor-pointer flex transition-all duration-200",
            className,
          )}
        >
          <div className="flex-col md:flex-row  w-full flex justify-between">
            <div className="flex flex-1 gap-3 items-center">
              <ItemMedia className="flex-1">
                <HoverCardTrigger
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewOpen(true);
                  }}
                  className="rounded-sm size-18 flex items-center justify-center  [&_path]:stroke-muted-foreground bg-primary-foreground border "
                >
                  <PlaybookIcon className="group-hover:scale-[1.2] transition-all duration-200" />
                </HoverCardTrigger>
              </ItemMedia>

              <div className="flex flex-col w-full md:flex-row gap-4 justify-between">
                <div>
                  <div className="row gap-2">
                    <ItemTitle
                      className={cn(
                        "text-lg font-semibold",
                        titleTextClassName,
                      )}
                    >
                      {playbook.topic}
                    </ItemTitle>
                    {hasSession && (
                      <span className="text-success-500 flex items-center gap-1 rounded-full pl-1 pr-2 py-1 text-xs bg-success-100">
                        <Check
                          size={15}
                          className="p-0.5 bg-success-500 text-white border-white  rounded-full"
                        />
                        Session Created
                      </span>
                    )}
                    {isFavorite && (
                      <StarIcon className="fill-accent-400 stroke-accent-400 size-4" />
                    )}
                  </div>
                  <ItemDescription className="text-xs">
                    {[playbook.courseName || "", timeAgo(playbook.createdAt)]
                      .filter((item) => Boolean(item))
                      .join(" • ")}
                  </ItemDescription>
                </div>

                <ItemActions className="flex gap-2 items-center">
                  {canEdit && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/editor/playbook/${playbook.id}`);
                      }}
                      className="shadow-sm border bg-primary-foreground"
                      variant="outline"
                    >
                      <PencilEdit />
                      Edit
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="shadow-sm border bg-primary-foreground"
                        onClick={(e) => e.stopPropagation()}
                        variant="outline"
                        size="icon"
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={handleFavorite}
                        disabled={isFavoriting || isUnfavoriting}
                      >
                        <StarIcon
                          className={
                            isFavorite
                              ? "fill-accent-400 stroke-accent-400"
                              : ""
                          }
                        />
                        {isFavorite ? "Unfavorite" : "Favorite"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePlaybook(playbook.id);
                        }}
                      >
                        <Delete /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ItemActions>
              </div>
            </div>
          </div>
        </Item>
        {strategies.length > 0 && (
          <HoverCardContent
            side="bottom"
            align="start"
            className="flex rounded-2xl w-screen border-none p-1 bg-white max-w-145"
          >
            {strategies.map((s) => (
              <StrategyCard
                headerClassName={`border-white 
                ${
                  s.phase === "warmup"
                    ? "rounded-l-xl rounded-r-0 border-r-2"
                    : s.phase === "workout"
                      ? "rounded-0"
                      : "rounded-r-xl border-l-2 rounded-l-0"
                }
                  
             `}
                className="gap-0 shadow-none"
                showActionButtons={false}
                showsSteps={false}
                key={s.id}
                strategy={s}
                phase={s.phase}
              />
            ))}
          </HoverCardContent>
        )}
      </HoverCard>
    </>
  );
};

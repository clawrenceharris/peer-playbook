import {
  Delete,
  PencilEdit,
  Playbook as PlaybookIcon,
} from "@/components/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui";
import { Check, MoreVertical, StarIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  useAddFavoritePlaybook,
  useMyFavoritePlaybooks,
  usePlaybookActions,
  usePlaybookSortedStrategies,
  useRemoveFavoritePlaybook,
} from "@/features/playbooks/presentation/hooks";
import { cn, timeAgo } from "@/lib/utils";
import { StrategyCard } from "@/features/strategies/components";
import { usePlaybookSessions } from "@/features/sessions/hooks";
import { useUser } from "@/components/providers";
import { useRouter } from "next/navigation";
import { PlaybookCardDTO } from "@/features/playbooks/application/dto";

interface PlaybookCardProps {
  playbook: {
    id: string;
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
        openDelay={300}
        open={!hoverDisabled && previewOpen}
        onOpenChange={setPreviewOpen}
      >
        <Card
          className={cn(
            "group/scenario-card relative w-full min-w-[330px] cursor-pointer overflow-hidden rounded-lg shadow-none transition-all",
            className,
          )}
          tabIndex={0}
          aria-label={`View playbook: ${playbook.topic}`}
          onClick={onNavigate}
        >
          <span
            aria-hidden
            className="bg-primary-300/80 absolute bottom-0 left-0 z-20 h-[6.6px] w-full opacity-0 group-focus-within/scenario-card:opacity-100 group-hover/scenario-card:opacity-100"
          />
          <CardHeader>
            <div>
              {playbook.creator && (
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="overflow-hidden">
                      <AvatarImage
                        src={playbook.creator.avatarUrl ?? undefined}
                      />
                      <AvatarFallback>
                        {playbook.creator.displayName.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flexflex-col gap-1">
                      <p className="font-heading text-sm leading-none font-medium">
                        {playbook.creator.displayName}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="bg-primary-foreground border shadow-sm"
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
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex w-full flex-col justify-between md:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex flex-1 items-center gap-3">
                  <HoverCardTrigger
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewOpen(true);
                    }}
                    className="[&_path]:stroke-muted-foreground bg-primary-foreground flex size-18 flex-1 items-center justify-center rounded-sm border"
                  >
                    <PlaybookIcon className="transition-all duration-200 group-hover:scale-[1.2]" />
                  </HoverCardTrigger>
                </div>
                <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <div className="row gap-2">
                      <CardTitle
                        className={cn(
                          "text-lg font-semibold",
                          titleTextClassName,
                          "line-clamp-2 max-w-[85%] flex-1 truncate text-lg font-semibold",
                        )}
                      >
                        {playbook.topic}
                      </CardTitle>
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
                        <StarIcon className="fill-accent-400 stroke-accent-400 size-4" />
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {[
                        playbook.courseName ?? "",
                        playbook.createdAt
                          ? timeAgo(playbook.createdAt?.toISOString())
                          : "",
                      ]
                        .filter((item) => Boolean(item))
                        .join(" • ")}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-2">
            {canEdit && (
              <CardAction>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/editor/playbook/${playbook.id}`);
                  }}
                  className="bg-primary-foreground border shadow-sm"
                  variant="outline"
                >
                  <PencilEdit />
                  Edit
                </Button>
              </CardAction>
            )}
          </CardFooter>
        </Card>
        {strategies.length > 0 && (
          <HoverCardContent
            side="bottom"
            align="start"
            className="flex w-screen max-w-145 rounded-2xl border-none bg-white p-1"
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

/*

<Card
      className={cn(
        "group/scenario-card relative w-full min-w-[330px] cursor-pointer rounded-md shadow-none transition-all",
        className,
      )}
      tabIndex={0}
      aria-label={`View scenario: ${scenario.title}`}
      onClick={handleClick}
    >
      <span
        aria-hidden
        className="bg-primary-300/80 absolute bottom-0 left-0 z-20 h-[5px] w-full opacity-0 group-focus-within/scenario-card:opacity-100 group-hover/scenario-card:opacity-100"
      />
      <CardHeader>
        <div>
          {scenario.actor && (
            <div className="flex flex-1 items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="overflow-hidden">
                  <AvatarImage src={scenario.actor.avatarUrl ?? undefined} />
                  <AvatarFallback>
                    {scenario.actor.displayName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flexflex-col gap-1">
                  <p className="font-heading text-sm leading-none font-medium">
                    {scenario.actor.displayName}
                  </p>
                  <p className="font-heading text-muted-foreground max-w-[85%] truncate text-sm leading-none">
                    {scenario.actor.role}
                  </p>
                </div>
              </div>
              <span className="text-success bg-success/20 rounded-full px-2 py-1 text-center text-xs font-semibold">
                {scenario.difficulty}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle
          title={scenario.title}
          className="line-clamp-2 max-w-[85%] flex-1 truncate text-lg font-semibold"
        >
          {scenario.title}
        </CardTitle>
        <CardDescription
          className="line-clamp-2 wrap-break-word"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            whiteSpace: "normal",
          }}
        >
          {scenario.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex items-center gap-2">
          <CardAction>
            <Button size="sm" onClick={handlePreviewClick} variant="muted">
              <Eye strokeWidth={3} className="size-4.5" />
              Preview
            </Button>
          </CardAction>
        </div>
      </CardFooter>
    </Card>

*/

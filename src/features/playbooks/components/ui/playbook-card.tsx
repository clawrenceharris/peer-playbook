import { Delete, PencilEdit, Playbook as PlaybookIcon } from "@/components/icons";
import {
  Button,
  Card,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui";
import { Playbook } from "@/features/playbooks/domain";
import { Check, MoreVertical, StarIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  usePlaybookActions,
  usePlaybookSortedStrategies,
  useToggleFavoritePlaybook,
} from "@/features/playbooks/hooks";
import { cn } from "@/lib/utils";
import { StrategyCard } from "@/features/strategies/components";
import { usePlaybookSessions } from "@/features/sessions/hooks";

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
  const { updatePlaybook, deletePlaybook } = usePlaybookActions();
  const { mutateAsync: toggleFavorite, isPending: favoritePending } =
    useToggleFavoritePlaybook();
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite({
      playbookId: playbook.id,
      favorite: !playbook.favorite,
    });
  };
  return (
    <>
      <HoverCard
        open={!hoverDisabled && previewOpen}
        onOpenChange={setPreviewOpen}
      >
        <Card
          onClick={onNavigate}
          key={playbook.id}
          className={cn(
            "group w-full rounded-md border-l-10 border-primary-400 flex-col max-w-4xl mx-auto bg-primary-foreground justify-center cursor-pointer flex transition-all duration-200",
            className,
          )}
        >
          <div className="flex-col md:flex-row  w-full flex justify-between">
            <div className="flex flex-1 gap-3 items-center">
              <div className="flex-1">
                <HoverCardTrigger
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewOpen(true);
                  }}
                  className="rounded-sm size-18 flex items-center justify-center  [&_path]:stroke-muted-foreground bg-primary-foreground border "
                >
                  <PlaybookIcon className="group-hover:scale-[1.2] transition-all duration-200" />
                </HoverCardTrigger>
              </div>

              <div className="flex flex-col w-full md:flex-row gap-4 justify-between">
                <div>
                  <div className="row gap-2">
                    <CardTitle
                      className={cn(
                        "text-md font-semibold",
                        titleTextClassName,
                      )}
                    >
                      {playbook.topic}
                      {hasSession && (
                        <span className="text-success-500 flex items-center gap-1 rounded-full pl-1 pr-2 py-1 text-xs bg-success-100">
                          <Check
                            size={15}
                            className="p-0.5 bg-success-500 text-white border-white  rounded-full"
                          />
                          Session Created
                        </span>
                      )}
                    </CardTitle>
                    {playbook.favorite && (
                      <StarIcon className="fill-accent-400 stroke-accent-400 size-4" />
                    )}
                  </div>
                  <span className="text-xs">
                    {[playbook.courseName || "", "timeAgo(playbook.createdAt)"]
                      .filter((item) => Boolean(item))
                      .join(" • ")}
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  {canEdit && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePlaybook(playbook.id);
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
                        disabled={favoritePending}
                      >
                        <StarIcon
                          className={
                            playbook.favorite
                              ? "fill-accent-400 stroke-accent-400"
                              : ""
                          }
                        />
                        {playbook.favorite ? "Unfavorite" : "Favorite"}
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
              </div>
            </div>
          </div>
        </Card>
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

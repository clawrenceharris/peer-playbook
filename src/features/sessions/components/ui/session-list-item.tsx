import { Delete, Session as SessionIcon } from "@/components/icons";
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
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { useState } from "react";
import { Icon } from "@/components/shared";
import { assets } from "@/lib/constants";
import { cn, timeAgo } from "@/lib/utils";
import { SessionCardDTO } from "../../application/dto";
import { useRouter } from "next/navigation";
import { Ban, MoreVertical, PieChart } from "lucide-react";
import {
  useCancelSession,
  useCompleteSession,
  useDeleteSession,
  useStartSession,
} from "../../hooks";
import { useModals } from "@/hooks";
import { useUser } from "@/components/providers";
import { SessionStatus } from "../../domain/value-objects";

interface SessionCardProps {
  session: SessionCardDTO;
  className?: string;
  onClick?: () => void;
}
export const SessionListItem = ({
  session,
  className,
  onClick,
}: SessionCardProps) => {
  const startSession = useStartSession();
  const completeSession = useCompleteSession();
  const cancelSession = useCancelSession();
  const { mutate: deleteSession } = useDeleteSession();
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useUser();
  const {
    modals: {
      confirmation: confirmationModal,
      "session:update": updateSessionModal,
    },
  } = useModals();
  const router = useRouter();
  function handleUpdateSessionClick() {
    updateSessionModal.open({
      session,
    });
  }

  const handleCancelSessionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    confirmationModal.open({
      title: "Cancel Session",
      description: "Are you sure you want to cancel this session?",
      onConfirm: () => {
        cancelSession({ sessionId: session.id, instructorId: user.id });
      },
    });
  };
  const handleDeleteSessionClick = () => {
    confirmationModal.open({
      title: "Delete Session",
      description: "Are you sure you want to delete this session?",
      onConfirm: () => {
        deleteSession(session.id);
      },
    });
  };
  const statusColor: Record<SessionStatus, string> = {
    scheduled: "bg-primary-50 text-primary-500",
    active: "bg-success-100 text-success-500",
    completed: "bg-gray-200 text-muted-foreground",
    canceled: "bg-destructive-100 text-destructive-500",
  };

  return (
    <Item
      className={cn(
        "bg-card relative w-full min-w-82 cursor-pointer overflow-hidden rounded-md",
        className,
      )}
      variant="outline"
      tabIndex={0}
      aria-label={`View session: ${session.title}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span
        aria-hidden
        className={cn(
          "bg-muted-foreground/20 absolute bottom-0 left-0 h-1.25 w-full opacity-0",
          isHovering && "opacity-100",
        )}
      />

      <ItemHeader>
        <span
          className={`flex max-w-20 items-center justify-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
            statusColor[session.status]
          }`}
        >
          {session.status?.replace("_", " ")}
        </span>
        <span className="text-muted-foreground text-sm">
          starts {timeAgo(session.scheduledStart)}
        </span>
      </ItemHeader>
      <ItemContent>
        <div className="flex h-17 w-full items-center gap-4">
          <ItemMedia
            variant="icon"
            className="flex aspect-square size-full max-w-18 shrink-0 items-center justify-center rounded-[8px] border"
          >
            <PieChart className="text-muted-foreground transition-all duration-200 group-hover:scale-[1.2]" />
          </ItemMedia>
          <div className="flex-1 space-y-1">
            <div className="flex flex-row gap-1">
              <ItemTitle
                className={cn("line-clamp-1 truncate text-lg font-semibold")}
              >
                {session.courseName && <span>{session.courseName + ": "}</span>}
                <span className="text-muted-foreground font-normal">
                  {session.topic}
                </span>
              </ItemTitle>
            </div>
            <ItemDescription className="spa text-sm">
              {`${session.topic}${session.courseName ? ` - ${session.courseName}` : ""}`}
            </ItemDescription>
          </div>
        </div>
      </ItemContent>

      <ItemActions>
        {session.status === "active" && (
          <Button
            variant={"destructive"}
            onClick={(e) => {
              e.stopPropagation();
              completeSession({ sessionId: session.id, instructorId: user.id });
            }}
            className="flex items-center gap-2"
          >
            End Session
          </Button>
        )}
        {session.status !== "active" && (
          <Button
            variant={"primary"}
            disabled={session.status === "canceled"}
            onClick={(e) => {
              e.stopPropagation();
              startSession({ sessionId: session.id, instructorId: user.id });
            }}
          >
            Start Session
          </Button>
        )}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/sessions/${session.id}`);
          }}
          className="bg-primary-foreground border shadow-sm"
          variant="outline"
        >
          <Icon src={assets.pencilEdit} alt="Edit" />
          Edit
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onFocus={() => setIsHovering(false)}

              onClick={(e) => e.stopPropagation()}
              variant="ghost"
              size="icon"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent avoidCollisions>
            {session.status !== "canceled" && session.status != "completed" && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateSessionClick();
                  }}
                >
                  <Icon
                    className="opacity-50"
                    src={assets.pencilEdit}
                    alt="Edit"
                  />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleCancelSessionClick}
                >
                  <Ban /> Cancel Session
                </DropdownMenuItem>
              </>
            )}
            {(session.status === "completed" ||
              session.status === "canceled") && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateSessionClick();
                  }}
                >
                  <SessionIcon /> Reschedule
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSessionClick();
              }}
            >
              <Delete /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
};

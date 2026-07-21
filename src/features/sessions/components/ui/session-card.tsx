import { Delete, Session as SessionIcon } from "@/components/icons";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useSessionActions } from "@/features/sessions/hooks";
import { Session } from "@/features/sessions/domain";
import { Ban, Loader2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Icon } from "@/components/shared";
import { assets } from "@/lib/constants";

interface SessionCardProps {
  session: Session;
}
export const SessionCard = ({ session }: SessionCardProps) => {
  const {
    updateSession,
    deleteSession,
    endSession,
    updateSessionStatus,
    startSession,
  } = useSessionActions();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const toggleSessionStatus = () => {
    setIsUpdatingStatus(true);
    if (session.status === "active") {
      endSession(session.id).then(() => setIsUpdatingStatus(false));
    } else if (
      session.status === "completed" ||
      session.status === "scheduled"
    ) {
      startSession(session.id).then(() => setIsUpdatingStatus(false));
    }
  };

  const handleUpdateSessionClick = () => {
    updateSession(session.id);
  };

  const handleCancelSessionClick = () => {
    updateSessionStatus(session.id, "canceled");
  };
  const handleDeleteSessionClick = () => {
    deleteSession(session.id);
  };
  const statusColor: Record<Session["status"], string> = {
    scheduled: "bg-primary-50 text-primary-500",
    active: "bg-success-100 text-success-500",
    completed: "bg-gray-200 text-muted-foreground",
    canceled: "bg-destructive-100 text-destructive-500",
  };

  return (
    <Card className="flex w-full flex-col justify-between overflow-hidden border shadow-md transition-shadow duration-200 hover:shadow-none">
      <CardHeader>
        <div className="mb-3 flex items-center justify-between">
          <CardTitle className="text-md flex items-center gap-1 font-semibold">
            {session.courseName && <span>{session.courseName + ":"}</span>}
            <span className="text-muted-foreground font-normal">
              {session.topic}
            </span>
          </CardTitle>
          <span
            className={`flex max-w-20 items-center justify-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
              statusColor[session.status]
            }`}
          >
            {session.status?.replace("_", " ")}
          </span>
        </div>
        {session.scheduledStart && (
          <div className="text-muted-foreground text-sm">
            {new Date(session.scheduledStart).toDateString()}
          </div>
        )}
      </CardHeader>

      <CardFooter className="flex justify-end gap-4">
        <div className="flex items-center gap-0.5">
          <Button
            variant={session.status === "active" ? "destructive" : "primary"}
            disabled={session.status === "canceled"}
            onClick={toggleSessionStatus}
          >
            {isUpdatingStatus ? (
              <Loader2 className="animate-spin" />
            ) : session.status === "active" ? (
              "End Session"
            ) : (
              "Start Session"
            )}
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button
              variant={"outline"}
              size="icon"
              onClick={handleUpdateSessionClick}
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent avoidCollisions align="start" className="z-999">
            {session.status !== "canceled" && session.status != "completed" && (
              <>
                <DropdownMenuItem onClick={handleUpdateSessionClick}>
                  <Icon src={assets.pencilEdit} alt="Edit" /> Update
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleCancelSessionClick}
                >
                  <Ban /> Cancel Session
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {(session.status === "completed" ||
              session.status === "canceled") && (
              <>
                <DropdownMenuItem onClick={handleUpdateSessionClick}>
                  <SessionIcon /> Reschedule
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem
              variant="destructive"
              onClick={handleDeleteSessionClick}
            >
              <Delete /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

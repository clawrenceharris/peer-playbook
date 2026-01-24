import { Delete, PencilEdit, Session as SessionIcon } from "@/components/icons";
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
    <Card className="overflow-hidden  shadow-md flex border-1 hover:shadow-none justify-between w-full flex-col transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center mb-3 justify-between">
          <CardTitle className="text-md gap-1 flex items-center font-semibold">
            {session.courseName && <span>{session.courseName + ":"}</span>}
            <span className="text-muted-foreground font-normal">
              {session.topic}
            </span>
          </CardTitle>
          <span
            className={`text-xs max-w-20 flex items-center justify-center px-2 py-1 rounded-full font-medium capitalize ${
              statusColor[session.status]
            }`}
          >
            {session.status?.replace("_", " ")}
          </span>
        </div>
        {session.scheduledStart && (
          <div className="text-sm text-muted-foreground">
            {new Date(session.scheduledStart).toDateString()}
          </div>
        )}
      </CardHeader>

      <CardFooter className="flex gap-4 justify-end">
        <div className="flex gap-0.5 items-center">
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
                  <PencilEdit /> Update
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

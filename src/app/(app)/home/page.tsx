"use client";
import { useUser } from "@/app/providers";
import { useSessionActions } from "@/features/sessions/hooks";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Playbook, Session } from "@/components/icons";
import { SessionCard } from "@/features/sessions/components";
import { useMyUpcomingSessions } from "@/features/sessions/hooks/use-user-sessions";
import { EmptyState } from "@/components/states";
import { Loader2 } from "lucide-react";
import { useRecentPlaybooks } from "@/features/playbooks/hooks";
import { PlaybookList } from "@/features/playbooks/components";

export default function Dashboard() {
  const router = useRouter();
  const { user, profile } = useUser();
  const { createSession } = useSessionActions();
  const { data: recentPlaybooks = [], isLoading: playbooksLoading } =
    useRecentPlaybooks(6);
  const { data: upcomingSessions = [], isLoading: sessionsLoading } =
    useMyUpcomingSessions(user.id);
  const handleCreatePlaybook = () => {
    router.push("/create-playbook");
  };
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-linear-to-t from-primary-400/60 to-background relative overflow-hidden">
        {/* Content */}
        <div className="max-w-3xl w-full items-center flex flex-col relative p-6 sm:py-8 lg:py-10 mx-auto space-y-12">
          {/* Welcome Header */}
          <div className="text-center max-w-md">
            <h1 className="text-4xl mb-2">Hi, {profile.firstName}!</h1>
            <p className="text-md">
              Ready to take peer learning to the next level? Choose an action
              below to create or plan your next session.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <HomeCard
              title="Create a Playbook"
              description="Build engaging SI strategies and activities for your next session"
              icon={<Playbook />}
              onClick={handleCreatePlaybook}
              buttonText={"Create"}
            />
            <HomeCard
              title="Schedule a Session"
              description="Plan and organize your upcoming SI sessions with students"
              icon={<Session />}
              onClick={createSession}
              buttonText={"Schedule"}
              variant="secondary"
            />
          </div>
        </div>
      </div>
      <div className="container">
        <section id="upcoming-sessions">
          <h2 className="text-2xl">Upcoming Sessions</h2>

          {sessionsLoading ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader2 className="text-primary-400 animate-spin" />
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <EmptyState
                title=""
                className="bg-transparent text-center"
                message="You don't have any upcoming sessions at the moment"
              />
            </div>
          )}
        </section>
        <section id="recent-playbooks">
          <h2 className="text-2xl">Recent Playbooks</h2>
          <div className="content-body">
            <PlaybookList
              onPlaybookClick={(playbook) =>
                router.push(`/library/playbooks/${playbook.id}`)
              }
              playbooks={recentPlaybooks}
              isLoading={playbooksLoading}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

interface HomeCardProps {
  icon: ReactNode;
  variant?: "primary" | "secondary";
  buttonText: string;
  onClick: () => void;
  description: string;
  title: string;
}
const HomeCard = ({
  icon,
  variant = "primary",
  buttonText,
  onClick,
  description,
  title,
}: HomeCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative group  cursor-pointer hover:shadow-lg shadow-md hover:-translate-y-1  transition-all duration-300",
        variant === "primary"
          ? "hover:bg-primary-400 shadow-primary-700/40"
          : "hover:bg-secondary-400 shadow-secondary-800/20"
      )}
    >
      <CardHeader>
        <div
          className={cn(
            "absolute flex items-center justify-center left-1/2 -translate-x-1/2 -top-6 w-13 h-13 [&_svg]:size-7 group-hover:to-white border-5 border-primary-foreground group-hover:from-white [&_path]:stroke-white rounded-full bg-gradient-to-br group-hover:scale-110 transition-transform duration-300",
            variant === "primary"
              ? "from-primary-400 to-primary-500 group-hover:[&_path]:stroke-primary-400 group-hover:border-primary-400"
              : "from-secondary-400 to-secondary-600 group-hover:[&_path]:stroke-secondary-400 group-hover:border-secondary-400"
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 ">
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-white">
            {title}
          </CardTitle>
          <CardDescription className="group-hover:text-white">
            {description}
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter>
        <CardAction className="w-full">
          <Button
            onClick={onClick}
            variant={variant}
            size="lg"
            className={cn(
              "w-full hover:scale-[1.02] text-white group-hover:bg-white",
              variant === "primary"
                ? "group-hover:text-primary-400"
                : "group-hover:text-secondary-400"
            )}
          >
            {buttonText}
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
};

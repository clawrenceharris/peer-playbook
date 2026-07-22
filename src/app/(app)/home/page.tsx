"use client";

import { useUser } from "@/components/providers";
import { Button } from "@/components/ui";
import { useRecentPlaybooks } from "@/features/playbooks/presentation/hooks";
import { useMyUpcomingSessions } from "@/features/sessions/hooks/use-user-sessions";
import { cn, timeAgo } from "@/lib/utils";
import type { PlaybookCardDTO } from "@/features/playbooks/application/dto";
import type { Session } from "@/features/sessions/domain";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { ContentLayout, UserNav } from "@/components/sidebar";
import { SearchInput } from "@/components/form";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import Image from "next/image";
import { assets } from "@/lib/constants";

const sessionDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const statusStyles: Record<Session["status"], string> = {
  active: "bg-success-100 text-success-700",
  canceled: "bg-destructive-100 text-destructive-700",
  completed: "bg-muted text-muted-foreground",
  scheduled: "bg-primary-50 text-primary-700",
};

const learningPrompts = [
  "Exam review",
  "Problem solving",
  "Peer games",
  "Reflection",
];

/**
 * The home page mixes live data (recent playbooks and upcoming sessions) with a
 * few placeholder or aspirational affordances while the broader dashboard UX is
 * still being filled in.
 */
export default function Dashboard() {
  const router = useRouter();
  const { user, profile } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: recentPlaybooks = [], isLoading: playbooksLoading } =
    useRecentPlaybooks(6);
  const { data: upcomingSessions = [], isLoading: sessionsLoading } =
    useMyUpcomingSessions(user.id);

  const sortedUpcomingSessions = useMemo(
    () =>
      [...upcomingSessions].sort(
        (a, b) => getDateTime(a.scheduledStart) - getDateTime(b.scheduledStart),
      ),
    [upcomingSessions],
  );

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const visiblePlaybooks = useMemo(() => {
    const matchingPlaybooks = normalizedSearchQuery
      ? recentPlaybooks.filter((playbook) =>
          [playbook.topic, playbook.courseName, playbook.subject]
            .filter(Boolean)
            .some((value) =>
              value?.toLowerCase().includes(normalizedSearchQuery),
            ),
        )
      : recentPlaybooks;

    return matchingPlaybooks.slice(0, 4);
  }, [normalizedSearchQuery, recentPlaybooks]);

  const firstName = profile?.firstName || "there";

  function handleHeroSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // The hero search currently narrows only the on-page recent-playbooks
    // section; it does not perform a global server search.
    document
      .getElementById("discover-playbooks")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <ContentLayout contentContainerClassName="p-0" showHeader={false}>
      <header className="header bg-secondary/70 relative z-0 border-b-0 px-3 py-4">
        <Image
          src={assets.wordmark}
          alt="PeerPlaybook logo"
          loading="eager"
          className="h-auto w-45"
          width={833}
          height={167}
        />
        <UserNav />
      </header>
      <section className="from-secondary/70 to-surface relative bg-linear-to-b pb-15">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] xl:px-8 xl:py-10">
          <div className="max-w-3xl space-y-7">
            <div className="space-y-3">
              <h1 className="text-secondary-foreground max-w-3xl text-3xl leading-tight font-bold tracking-normal sm:text-4xl lg:text-5xl">
                Welcome, {firstName}.
              </h1>
              <p className="text-secondary-foreground text-xl font-bold">
                Ready to build your next session?
              </p>
              <p className="text-secondary-foreground max-w-2xl text-base sm:text-lg">
                Start planning study sessions that get students talking,
                practicing, and learning together.
              </p>
            </div>

            <form
              onSubmit={handleHeroSearchSubmit}
              className="flex max-w-2xl flex-col gap-3 p-2 sm:flex-row"
            >
              <SearchInput
                placeholder="Search for playbooks, resources, or peers"
                id="home-search"
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                className="h-13 min-w-0 flex-1 rounded-md text-base font-semibold"
              >
                <InputGroupAddon align="inline-end">
                  <InputGroupButton type="submit" variant="primary">
                    Search
                  </InputGroupButton>
                </InputGroupAddon>
              </SearchInput>
            </form>

            <div className="flex flex-wrap gap-2">
              {learningPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  variant="ghost"
                  onClick={() => setSearchQuery(prompt)}
                  className="text-muted-foreground hover:border-primary-200 hover:text-foreground bg-card rounded-md border px-3 py-2 text-sm font-semibold"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          <TodaySection />
        </div>
      </section>

      <div className="bg-surface w-full space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="grid gap-4 pt-10 md:grid-cols-2">
          <ActionTile
            title="Create a playbook"
            description="Build a game-ready plan with activities, prompts, and phases that fit the way students learn together."
            actionLabel="Start building"
            onClick={() => router.push("/playbooks/create")}
            artwork={<CreatePlaybookArtwork />}
            tone="primary"
          />
          <ActionTile
            title="Schedule a session"
            description="Set the time, gather the group, and keep your next peer-learning session organized."
            actionLabel="Plan session"
            onClick={() => {}}
            artwork={<ScheduleSessionArtwork />}
            tone="secondary"
          />
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <section className="space-y-4">
            <SectionHeader
              title="Ready to host"
              description="Sessions that are closest to becoming live peer practice."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/sessions")}
                >
                  View all
                  <ArrowRight />
                </Button>
              }
            />

            {sessionsLoading ? (
              <LoadingPanel label="Loading upcoming sessions" />
            ) : sortedUpcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {sortedUpcomingSessions.slice(0, 3).map((session) => (
                  <UpcomingSessionCard
                    key={session.id}
                    session={session}
                    onOpen={() =>
                      router.push(`/session/playfield/${session.id}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <HomeEmptyState
                artwork={<EmptySessionGraphic />}
                title="No sessions scheduled"
                message="Pick a playbook or start fresh, then put the next practice on the calendar."
                actionLabel="Schedule session"
                onAction={() => {}}
              />
            )}
          </section>

          <section id="discover-playbooks" className="scroll-mt-6 space-y-4">
            <SectionHeader
              title="Discover your playbooks"
              description={
                normalizedSearchQuery
                  ? `Showing matches for "${searchQuery.trim()}".`
                  : "Recent plans, review games, and activity ideas worth revisiting."
              }
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/my-library/playbooks")}
                >
                  Library
                  <ArrowRight />
                </Button>
              }
            />

            {playbooksLoading ? (
              <LoadingPanel label="Loading playbooks" />
            ) : visiblePlaybooks.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {visiblePlaybooks.map((playbook) => (
                  <RecentPlaybookCard
                    key={playbook.id}
                    playbook={playbook}
                    onOpen={() => router.push(`/playbooks/${playbook.id}`)}
                  />
                ))}
              </div>
            ) : (
              <HomeEmptyState
                artwork={<EmptyPlaybookGraphic />}
                title={
                  normalizedSearchQuery
                    ? "No matching playbooks"
                    : "No playbooks yet"
                }
                message={
                  normalizedSearchQuery
                    ? "Try a course, topic, or activity style from your library."
                    : "Your first playbook can be a game plan for the next topic students need to practice."
                }
                actionLabel={
                  normalizedSearchQuery ? "Clear search" : "Create playbook"
                }
                onAction={() =>
                  normalizedSearchQuery
                    ? setSearchQuery("")
                    : router.push("/playbooks/create")
                }
              />
            )}
          </section>
        </div>
      </div>
    </ContentLayout>
  );
}

interface ActionTileProps {
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
  artwork: ReactNode;
  tone: "primary" | "secondary";
}

function ActionTile({
  title,
  description,
  actionLabel,
  onClick,
  artwork,
  tone,
}: ActionTileProps) {
  return (
    <article
      className={cn(
        "flex min-h-64 flex-col overflow-hidden rounded-lg border shadow-sm lg:flex-row",
        tone === "primary"
          ? "bg-primary-400 text-primary-900"
          : "bg-secondary-400 text-secondary-800",
      )}
    >
      <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
        <div className="space-y-3">
          <h2 className="text-2xl leading-tight font-bold">{title}</h2>
          <p className="max-w-md text-sm leading-6">{description}</p>
        </div>
        <Button
          type="button"
          className={tone === "primary" ? "bg-primary-900" : "bg-secondary-800"}
          variant={tone === "primary" ? "primary" : "secondary"}
          onClick={onClick}
        >
          {actionLabel}
          <ArrowRight />
        </Button>
      </div>
      <div
        className={cn(
          "flex min-h-34 flex-1 items-center justify-center p-4 md:border-t-0",
          tone === "primary" ? "bg-primary-100" : "bg-secondary-300",
        )}
      >
        {artwork}
      </div>
    </article>
  );
}

interface SectionHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-foreground text-2xl leading-tight font-bold">
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-6">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

interface UpcomingSessionCardProps {
  session: Session;
  onOpen: () => void;
}

function UpcomingSessionCard({ session, onOpen }: UpcomingSessionCardProps) {
  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {session.courseName && (
              <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs font-bold">
                {session.courseName}
              </span>
            )}
            <span
              className={cn(
                "rounded-md px-2 py-1 text-xs font-bold capitalize",
                statusStyles[session.status],
              )}
            >
              {session.status}
            </span>
          </div>
          <h3 className="text-foreground line-clamp-2 text-xl leading-tight font-bold">
            {session.topic || "Untitled session"}
          </h3>
          <p className="text-muted-foreground text-sm font-medium">
            {formatSessionDate(session.scheduledStart)}
          </p>
        </div>
        <MiniSessionMark />
      </div>

      <div className="mt-5 flex justify-end">
        <Button size="sm" variant="primary" onClick={onOpen}>
          Open room
          <ArrowRight />
        </Button>
      </div>
    </article>
  );
}

interface RecentPlaybookCardProps {
  playbook: PlaybookCardDTO;
  onOpen: () => void;
}

function RecentPlaybookCard({ playbook, onOpen }: RecentPlaybookCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group hover:border-primary-200 focus-visible:ring-ring/30 flex min-h-34 w-full flex-col justify-between rounded-lg border bg-white p-4 text-left shadow-sm transition hover:shadow-md focus-visible:ring-3 focus-visible:outline-none"
    >
      <div className="flex items-start gap-3">
        <MiniPlaybookMark />
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground line-clamp-2 text-lg leading-tight font-bold">
            {playbook.topic}
          </h3>
          <p className="text-muted-foreground mt-1 truncate text-sm">
            {[playbook.courseName, playbook.subject]
              .filter(Boolean)
              .join(" / ")}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-bold">
          {formatTimeAgo(playbook)}
        </span>
        <ArrowRight className="text-primary-700 size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}

interface LoadingPanelProps {
  label: string;
}

function LoadingPanel({ label }: LoadingPanelProps) {
  return (
    <div className="text-muted-foreground flex min-h-48 items-center justify-center rounded-lg border bg-white text-sm font-semibold shadow-sm">
      <Loader2 className="text-primary-600 mr-2 size-4 animate-spin" />
      {label}
    </div>
  );
}

interface HomeEmptyStateProps {
  artwork: ReactNode;
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

function HomeEmptyState({
  artwork,
  title,
  message,
  actionLabel,
  onAction,
}: HomeEmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed bg-white p-6 shadow-sm">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        {artwork}
        <div className="space-y-1">
          <h3 className="text-foreground text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground text-sm leading-6">{message}</p>
        </div>
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

function TodaySection() {
  return (
    <div className="bg-surface relative mx-auto w-full max-w-md rounded-lg border-[1.6px] p-4 xl:absolute xl:right-5 xl:-bottom-10">
      <h2 className="text-foreground mb-4 text-lg font-bold">
        Today&apos;s agenda
      </h2>
      <ScheduleTimelineCard />
    </div>
  );
}
type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  color: "green" | "purple" | "orange" | "cyan";
  status?: string;
};

// Static agenda content used for the dashboard visual until the "today" panel
// is wired to real session/playbook activity.
const scheduleItems: ScheduleItem[] = [
  {
    id: "1",
    time: "9:00 AM",
    title: "Circle of Connections",
    subtitle: "Icebreaker",
    color: "green",
    status: "Upcoming",
  },
  {
    id: "2",
    time: "10:30 AM",
    title: "Debate Challenge",
    subtitle: "Critical thinking",
    color: "purple",
    status: "Upcoming",
  },
  {
    id: "3",
    time: "1:00 PM",
    title: "Build & Explain",
    subtitle: "Problem solving",
    color: "orange",
    status: "Upcoming",
  },
];

const colorStyles = {
  green: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-600",
  },
  purple: {
    dot: "bg-purple-500",
    badge: "bg-purple-100 text-purple-600",
  },
  orange: {
    dot: "bg-orange-400",
    badge: "bg-orange-100 text-orange-600",
  },
  cyan: {
    dot: "bg-cyan-400",
    badge: "bg-cyan-100 text-cyan-600",
  },
};

export function ScheduleTimelineCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl p-6">
      <div className="relative space-y-7">
        {/* vertical line */}
        <div className="absolute top-2 bottom-12 left-1.75 w-px bg-slate-200" />

        {scheduleItems.map((item) => {
          const styles = colorStyles[item.color];

          return (
            <div key={item.id} className="relative flex gap-4">
              {/* dot */}
              <div
                className={cn(
                  "relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full ring-4 ring-white",
                  styles.dot,
                )}
              />

              {/* content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-400">
                  {item.time}
                </p>

                <div className="mt-1 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-[#171341]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {item.subtitle}
                    </p>
                  </div>

                  {item.status && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-xs font-bold",
                        styles.badge,
                      )}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="ml-8 flex items-center gap-2 text-sm font-bold text-cyan-500 transition-colors hover:text-cyan-600"
        >
          View full schedule
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CreatePlaybookArtwork({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Abstract playbook with colored strategy tabs"
    >
      {/* Soft background blob */}
      <rect x="0" y="0" width="420" height="260" rx="28" fill="#ECFBFF" />

      {/* Colored playbook tabs */}
      <rect x="54" y="58" width="92" height="46" rx="16" fill="#21C866" />
      <rect x="164" y="58" width="92" height="46" rx="16" fill="#A855F7" />
      <rect x="274" y="58" width="92" height="46" rx="16" fill="#F99A0A" />

      {/* Tab inner highlight pills */}
      <rect x="76" y="75" width="48" height="8" rx="4" fill="#BDF8D2" />
      <rect x="186" y="75" width="48" height="8" rx="4" fill="#E9D5FF" />
      <rect x="296" y="75" width="48" height="8" rx="4" fill="#FFE1B2" />

      {/* Main playbook page */}
      <rect
        x="42"
        y="96"
        width="336"
        height="120"
        rx="22"
        fill="white"
        stroke="#DDE7F0"
        strokeWidth="2"
      />

      {/* Page content dots */}
      <circle cx="78" cy="128" r="6" fill="#21C866" />
      <circle cx="78" cy="158" r="6" fill="#A855F7" />
      <circle cx="78" cy="188" r="6" fill="#F99A0A" />

      {/* Page content text pills */}
      <rect x="96" y="121" width="174" height="12" rx="6" fill="#DCE3EA" />
      <rect x="286" y="121" width="50" height="12" rx="6" fill="#EEF2F6" />

      <rect x="96" y="151" width="210" height="12" rx="6" fill="#DCE3EA" />
      <rect x="318" y="151" width="28" height="12" rx="6" fill="#EEF2F6" />

      <rect x="96" y="181" width="132" height="12" rx="6" fill="#DCE3EA" />
      <rect x="244" y="181" width="84" height="12" rx="6" fill="#EEF2F6" />

      {/* Subtle page shadow */}
      <path
        d="M66 216H354"
        stroke="#D8E4EC"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
export function ScheduleSessionArtwork({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Abstract session calendar with colored phase blocks"
    >
      {/* Background */}
      <rect x="0" y="0" width="420" height="260" rx="28" fill="#e9d5ff" />

      {/* Calendar shadow/base */}
      <rect
        x="70"
        y="44"
        width="280"
        height="172"
        rx="24"
        fill="white"
        stroke="#DDE3F0"
        strokeWidth="2"
      />

      {/* Calendar top bar */}
      <rect x="70" y="44" width="280" height="44" rx="24" fill="#EEE7FF" />
      <rect x="70" y="66" width="280" height="22" fill="#EEE7FF" />

      {/* Binding tabs */}
      <rect x="116" y="28" width="18" height="34" rx="9" fill="#A855F7" />
      <rect x="286" y="28" width="18" height="34" rx="9" fill="#A855F7" />

      {/* Calendar grid */}
      <line
        x1="140"
        y1="88"
        x2="140"
        y2="216"
        stroke="#E6EBF2"
        strokeWidth="2"
      />
      <line
        x1="210"
        y1="88"
        x2="210"
        y2="216"
        stroke="#E6EBF2"
        strokeWidth="2"
      />
      <line
        x1="280"
        y1="88"
        x2="280"
        y2="216"
        stroke="#E6EBF2"
        strokeWidth="2"
      />

      <line
        x1="70"
        y1="130"
        x2="350"
        y2="130"
        stroke="#E6EBF2"
        strokeWidth="2"
      />
      <line
        x1="70"
        y1="172"
        x2="350"
        y2="172"
        stroke="#E6EBF2"
        strokeWidth="2"
      />

      {/* Colored session blocks */}
      <rect x="80" y="93" width="52" height="32" rx="9" fill="#21C866" />
      <rect x="222" y="136" width="52" height="32" rx="9" fill="#A855F7" />
      <rect x="292" y="178" width="52" height="32" rx="9" fill="#F99A0A" />
      <rect x="151" y="178" width="52" height="32" rx="9" fill="#27C7E8" />
    </svg>
  );
}
function MiniPlaybookMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className="bg-primary-50 size-12 shrink-0 rounded-md"
    >
      <rect x="12" y="9" width="23" height="30" rx="5" fill="#FFFFFF" />
      <path
        d="M17 15h14M17 22h10M17 29h13"
        stroke="#008FC3"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M31 9v14l-5-4-5 4V9h10z" fill="#F59E0B" />
    </svg>
  );
}

function MiniSessionMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 52 52"
      className="bg-secondary-50 size-12 shrink-0 rounded-md"
    >
      <circle cx="18" cy="21" r="7" fill="#1FC8F2" />
      <circle cx="34" cy="21" r="7" fill="#A855F7" />
      <path
        d="M9 39c5-12 14-12 19 0M24 39c5-12 14-12 19 0"
        fill="none"
        stroke="#1E1B4B"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmptySessionGraphic() {
  return (
    <svg aria-hidden viewBox="0 0 120 86" className="h-auto w-32">
      <rect x="18" y="18" width="84" height="54" rx="14" fill="#FFFFFF" />
      <rect
        x="18"
        y="18"
        width="84"
        height="54"
        rx="14"
        fill="none"
        stroke="#D8B4FE"
        strokeWidth="5"
      />
      <path d="M18 38h84" stroke="#D8B4FE" strokeWidth="5" />
      <circle cx="44" cy="55" r="7" fill="#1FC8F2" />
      <circle cx="61" cy="55" r="7" fill="#A855F7" />
      <circle cx="78" cy="55" r="7" fill="#F59E0B" />
    </svg>
  );
}

function EmptyPlaybookGraphic() {
  return (
    <svg aria-hidden viewBox="0 0 120 86" className="h-auto w-32">
      <rect x="31" y="14" width="58" height="62" rx="14" fill="#FFFFFF" />
      <rect
        x="31"
        y="14"
        width="58"
        height="62"
        rx="14"
        fill="none"
        stroke="#94EAFF"
        strokeWidth="5"
      />
      <path
        d="M47 32h27M47 45h20M47 58h25"
        stroke="#008FC3"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="88" cy="22" r="12" fill="#F59E0B" />
    </svg>
  );
}

function getDateTime(value: Date | string | null | undefined) {
  // Missing or invalid dates sort to the end of lists instead of breaking the
  // dashboard ordering logic.
  if (!value) return Number.POSITIVE_INFINITY;
  const date = new Date(value);
  const time = date.getTime();
  return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
}

function formatSessionDate(value: Date | string | null | undefined) {
  const time = getDateTime(value);
  if (!Number.isFinite(time)) return "Date to be set";
  return sessionDateFormatter.format(new Date(time));
}

function formatTimeAgo(playbook: PlaybookCardDTO) {
  const value = playbook.updatedAt ?? playbook.createdAt;
  return value ? timeAgo(new Date(value).toISOString()) : "";
}

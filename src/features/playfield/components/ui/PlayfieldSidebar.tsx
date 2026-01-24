import { EmptyState, LoadingState } from "@/components/states";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { usePlaybook } from "@/features/playbooks/hooks";
import { PlaybookStrategy } from "@/features/playbooks/domain";
import { Session } from "@/features/sessions/domain";
import { registry } from "@/activities/registry";
import { VirtualStrategyCard } from "@/features/strategies/components";
import { useStreamCall } from "@/features/stream/hooks";

interface PlayfieldSidebarProps {
  session: Session;
  onTabChange: (tab: string) => void;
  open: boolean;
  activeTab: string;
  playbookId: string;
  onOpenChange: (open: boolean) => void;
  onStrategyClick: (strategy: PlaybookStrategy) => void;
}
export function PlayfieldSidebar({
  session,
  open,
  playbookId,
  onOpenChange,
  onTabChange,
  onStrategyClick,
  activeTab,
}: PlayfieldSidebarProps) {
  const { data: playbook, isLoading: loadingLesson } = usePlaybook(playbookId);
  const call = useStreamCall();
  const isHost = call.isCreatedByMe;
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="p-6 z-9999 overflow-auto" side="left">
          <SheetDescription className="sr-only">
            Access the agenda, activities and chat for this session
          </SheetDescription>
          <SheetHeader>
            <div className="flex justify-between items-center"></div>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-md font-semibold">
                {`${session?.courseName ? session.courseName + ":" : ""}`}{" "}
                <span className="font-light">{session?.topic}</span>
              </SheetTitle>
            </div>
            {session?.scheduledStart && (
              <div className="text-sm text-muted-foreground">
                {new Date(session.scheduledStart).toDateString()}
              </div>
            )}
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="w-full mb-10">
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="agenda">
              {loadingLesson ? (
                <LoadingState size={40} />
              ) : playbook?.strategies && playbook.strategies.length > 0 ? (
                <ul className="space-y-6">
                  {playbook.strategies.map((s) => (
                    <li key={s.id}>
                      <VirtualStrategyCard
                        strategy={s}
                        description={
                          s.id in registry
                            ? "This strategy is set up for Playfield"
                            : undefined
                        }
                        actionLabel={
                          s.id in registry && isHost
                            ? "Queue Strategy"
                            : undefined
                        }
                        onAction={() => {
                          onStrategyClick(s);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex flex-col justify-center items-center">
                  <EmptyState message="No agenda has been created." />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}

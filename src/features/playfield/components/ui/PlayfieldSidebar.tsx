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
import { usePlaybookDetail } from "@/features/playbooks/presentation/hooks";
import { Session } from "@/features/sessions/domain";
import { registry } from "@/activities/registry";
import { VirtualStrategyCard } from "@/features/strategies/components";
import { useStreamCall } from "@/features/stream/hooks";
import { PlaybookStrategyCardDTO } from "@/features/playbooks/application/dto";

interface PlayfieldSidebarProps {
  session: Session;
  onTabChange: (tab: string) => void;
  open: boolean;
  activeTab: string;
  playbookId: string;
  onOpenChange: (open: boolean) => void;
  onStrategyClick: (strategy: PlaybookStrategyCardDTO) => void;
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
  const { data: playbook, isLoading: loadingLesson } =
    usePlaybookDetail(playbookId);
  const call = useStreamCall();
  const isHost = call.isCreatedByMe;
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="z-9999 overflow-auto p-6" side="left">
          <SheetDescription className="sr-only">
            Access the agenda, activities and chat for this session
          </SheetDescription>
          <SheetHeader>
            <div className="flex items-center justify-between"></div>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-md font-semibold">
                {`${session?.courseName ? session.courseName + ":" : ""}`}{" "}
                <span className="font-light">{session?.topic}</span>
              </SheetTitle>
            </div>
            {session?.scheduledStart && (
              <div className="text-muted-foreground text-sm">
                {new Date(session.scheduledStart).toDateString()}
              </div>
            )}
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="mb-10 w-full">
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
                <div className="flex h-full flex-col items-center justify-center">
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

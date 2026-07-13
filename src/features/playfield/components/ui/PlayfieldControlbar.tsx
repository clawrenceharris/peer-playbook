import { usePlaybookDetail } from "@/features/playbooks/presentation/hooks";
import { useMemo } from "react";
import { LoadingState } from "@/components/states";
import { Button } from "@/components/ui";
import { getCardIcon } from "@/utils";
import { cn } from "@/lib/utils";
import { Play, Squircle, X } from "lucide-react";
import { usePlayfield } from "@/components/providers";
import { PlayfieldDefinition } from "../../domain";
import { useStreamCall } from "@/features/stream/hooks";
import { PlaybookStrategyCardDTO } from "@/features/playbooks/application/dto";
import { PHASE_STYLES } from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";

interface PlayfieldPreviewProps {
  strategyDef: PlayfieldDefinition;
  playbookId: string;
  onJoin: () => void;
  onLeave: () => void;
  onEnd: () => void;
}

function StrategyInfo({ strategy }: { strategy: PlaybookStrategyCardDTO }) {
  return (
    <div className="flex w-full items-center gap-2 md:gap-4">
      <div className="icon-ghost mr-1">
        {getCardIcon(PHASE_STYLES[strategy.phase].icon)}
      </div>
      <div className="w-full">
        <h2 className="text-xl font-bold">{strategy.title} </h2>

        <div className="flex items-center justify-between">
          <span className="text-background/70 text-sm font-light uppercase">
            {strategy.phase}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PlayfieldControlbar({
  strategyDef,
  onJoin,
  playbookId,
  onLeave,
  onEnd,
}: PlayfieldPreviewProps) {
  const { data: playbook, isLoading } = usePlaybookDetail(playbookId);
  const strategy = useMemo(
    () => playbook?.strategies.find((s) => s.slug === strategyDef.slug),
    [playbook?.strategies, strategyDef.slug],
  );
  const {
    layout: { state },
  } = usePlayfield();
  const call = useStreamCall();
  if (isLoading) return <LoadingState variant="container" />;
  if (!strategy) return null;
  if (state === "expanded") {
    return (
      <div
        className={cn(
          "center-all",
          "text-background fixed top-25 left-0 z-999 flex-1 gap-6 rounded-r-2xl px-1 py-4 shadow-md shadow-black/20 transition-shadow duration-200 hover:shadow-lg md:px-5",
        )}
      >
        <Button
          variant="tertiary"
          size="icon"
          aria-label="Leave Playfield"
          className="text-foreground hover:bg-background/80 hover:scale-[1.02]"
          onClick={onLeave}
        >
          <X className="scale-x-[-1]" />
        </Button>
        {call.isCreatedByMe && (
          <Button
            variant="tertiary"
            size="icon"
            aria-label="End Playfield for everyone"
            className="text-destructive-500 hover:bg-destructive-100 hover:scale-[1.02]"
            onClick={onEnd}
          >
            <Squircle fill="var(--color-destructive-500)" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "center-all",
        "text-background fixed top-3 left-0 z-999 flex flex-1 items-center justify-between gap-8 rounded-r-2xl p-2 shadow-md shadow-black/20 transition-shadow duration-200 hover:shadow-lg md:top-5 md:px-5",
      )}
    >
      <StrategyInfo strategy={strategy} />
      <div className="flex items-center gap-2">
        {call.isCreatedByMe && (
          <Button
            variant="tertiary"
            size="icon"
            className="text-destructive-500 hover:bg-destructive-100 hover:scale-[1.02]"
            onClick={onEnd}
          >
            <Squircle fill="var(--color-destructive-500)" />
          </Button>
        )}
        <Button
          variant="tertiary"
          size="icon"
          aria-label="Start Playfield"
          className="text-primary-400 hover:bg-primary-100 hover:scale-[1.02]"
          onClick={onJoin}
        >
          <Play fill="var(--color-primary-400)" />
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { PlaybookStrategyDetailDTO } from "@/features/playbooks/application/dto";
import { PhaseIntentDTO } from "@/features/reference-data/phase-intents/application/dto/PhaseIntentDTO";
import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import clsx from "clsx";
import { LucideProps, Plus } from "lucide-react";

type StrategyStepsSectionProps = {
  strategy: {
    id: string;
    title: string;
    steps: string[];
    phase: {
      id: string;
      label: string;
      title: string;
      intent: PhaseIntent;
      position: number;
      Icon: React.ComponentType<LucideProps>;
    };
  } | null;
};

export function StrategyDetails({ strategy }: StrategyStepsSectionProps) {
  if (!strategy)
    return (
      <div className="text-muted-foreground flex h-full flex-1 items-center justify-center rounded-lg border border-dashed text-sm">
        No strategies yet for this phase.
      </div>
    );

  return (
    <div>
      <h2 className="text-foreground text-2xl font-bold">{strategy.title}</h2>
      <section className="space-y-4 rounded-lg border p-5 shadow-xs">
        <h3 className="text-foreground text-lg font-semibold">Steps</h3>
        <ol className="text-foreground/80 space-y-4">
          {strategy.steps.map((s: string, i: number) => (
            <li className="flex items-center gap-1" key={i}>
              <div
                className={`flex size-7 items-center justify-center rounded-full ${clsx(
                  {
                    "text-intent-activate bg-intent-activate/10":
                      strategy.phase.intent === PhaseIntent.ACTIVATE,
                    "text-intent-apply bg-intent-apply/10":
                      strategy.phase.intent === PhaseIntent.APPLY,
                    "text-intent-reflect bg-intent-reflect/10":
                      strategy.phase.intent === PhaseIntent.REFLECT,
                    "text-intent-explore bg-intent-explore/10":
                      strategy.phase.intent === PhaseIntent.EXPLORE,
                    "text-intent-transition bg-intent-transition/10":
                      strategy.phase.intent === PhaseIntent.TRANSITION,
                  },
                )}`}
              >
                <span>{i + 1}</span>
              </div>

              <p className="max-w-sm rounded-md p-3">{s}</p>
            </li>
          ))}
        </ol>
        <Button variant="outline">
          <Plus className="size-4" /> Add Step
        </Button>
      </section>
    </div>
  );
}

import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { PlaybookStrategy } from "@/features/playbooks/domain";
import { getCardBackgroundColor, getCardIcon } from "@/utils";
import { PlaybookStrategyCardDTO } from "@/features/playbooks/application/dto";
import {
  PHASE_INTENT_ICONS,
  PHASE_STYLES,
} from "@/features/reference-data/phase-intents/domain/constants/phase-intents.constants";

interface VirtualStrategyCardProps {
  strategy: PlaybookStrategyCardDTO;
  onAction?: () => void;
  description?: string;
  actionLabel?: string;
  showsDescription?: boolean;
}

export const VirtualStrategyCard = ({
  strategy,
  actionLabel,
  description,
  showsDescription = true,
  onAction,
}: VirtualStrategyCardProps) => {
  const Icon = PHASE_INTENT_ICONS[strategy.phase];
  return (
    <Card className="strategy-card border-border bg-card text-card-foreground relative flex-1 rounded-2xl border p-0 shadow-md transition-transform">
      <CardHeader
        className={cn(
          `text-background relative flex items-center gap-6 rounded-tl-2xl rounded-tr-2xl p-3`,
          `${PHASE_STYLES[strategy.phase].card}`,
        )}
      >
        <div className="bg-foreground/20 flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full">
          <Icon />
        </div>
        <div className="w-full">
          <div>
            <h2 className="text-xl font-bold">{strategy.title} </h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-background/70 text-sm font-light uppercase">
              {strategy.phase}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showsDescription && (
          <CardDescription>
            <p className="text-muted-foreground bg-muted rounded-xl px-5 py-3 text-center text-sm">
              {description || strategy.title}
            </p>
          </CardDescription>
        )}
      </CardContent>
      {onAction && actionLabel && (
        <CardFooter className="flex w-full justify-end p-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </CardFooter>
      )}
    </Card>
  );
};

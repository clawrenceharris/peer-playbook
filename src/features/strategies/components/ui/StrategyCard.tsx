import React, { forwardRef, HTMLAttributes, ReactNode } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { PlaybookStrategy } from "@/features/playbooks/domain";
import { cn } from "@/lib/utils";
import { getCardBackgroundColor, getCardIcon } from "@/utils";
import { Bookmark, ListRestart } from "lucide-react";
import clsx from "clsx";

export interface StrategyCardProps extends HTMLAttributes<HTMLDivElement> {
  strategy: {
    id: string;
    title: string;
    steps: string[];
  };
  phase?: PlaybookStrategy["phase"];
  onClick?: () => void;
  children?: ReactNode;
  headerClassName?: string;
  showActionButtons?: boolean;
  onReplaceClick?: () => void;
  showsSteps?: boolean;
  onSaveClick?: () => void;
  isSaved?: boolean;
}
interface CardGhostProps {
  style?: React.CSSProperties;
  phase: PlaybookStrategy["phase"];
}
export const CardGhost = ({ phase, style }: CardGhostProps) => {
  return (
    <div
      style={style}
      className="bg-card text-card-foreground transform-gpu rounded-2xl border p-4 opacity-90 shadow-lg"
    >
      <div
        className={`h-10 ${getCardBackgroundColor(phase)} mb-3 rounded-md`}
      />
      <div className="space-y-2">
        <div className="bg-muted h-3 rounded" />
        <div className="bg-muted h-3 rounded" />
        <div className="bg-muted h-3 rounded" />
      </div>
    </div>
  );
};

// eslint-disable-next-line react/display-name
export const StrategyCard = forwardRef<HTMLDivElement, StrategyCardProps>(
  (
    {
      onClick,
      headerClassName,
      showActionButtons = true,
      onReplaceClick,
      phase,
      showsSteps = true,
      children,
      strategy,
      className,
      onSaveClick,
      isSaved = false,
      ...props
    }: StrategyCardProps,
    ref,
  ) => {
    return (
      <Card
        ref={ref}
        onClick={onClick}
        className={cn(
          "relative w-full rounded-2xl p-0 shadow-md",
          showsSteps ? "rounded-b-0 rounded-t-xl" : "",
          className,
        )}
        {...props}
      >
        <CardHeader
          className={cn(
            `text-background relative items-center gap-3 p-3`,
            `${phase && getCardBackgroundColor(phase)}`,
            headerClassName,
          )}
        >
          <div className="flex items-center gap-4">
            <div className="icon-ghost bg-foreground/20 flex items-center justify-center rounded-full">
              {phase && getCardIcon(phase)}
            </div>
            <div className="w-full">
              <div>
                <CardTitle
                  title={strategy.title}
                  className="line-clamp-1 text-xl font-bold"
                >
                  {strategy.title}
                </CardTitle>
                <span className="text-background/70 text-sm font-light uppercase">
                  {phase}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            {showActionButtons && (
              <div className="flex">
                <Tooltip>
                  <TooltipContent>Replace</TooltipContent>
                  <TooltipTrigger asChild>
                    <Button
                      className="rounded-full text-white hover:bg-white hover:text-black"
                      variant={"ghost"}
                      size={"icon"}
                      aria-label="Replace strategy"
                      onClick={onReplaceClick}
                    >
                      <ListRestart />
                    </Button>
                  </TooltipTrigger>
                </Tooltip>

                <Tooltip>
                  <TooltipContent>{isSaved ? "Unsave" : "Save"}</TooltipContent>
                  <TooltipTrigger asChild>
                    <Button
                      className="rounded-full text-white hover:bg-white hover:text-black"
                      variant="ghost"
                      size="icon"
                      aria-label={isSaved ? "Unsave strategy" : "Save strategy"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSaveClick?.();
                      }}
                    >
                      <Bookmark className={cn(isSaved && "fill-current")} />
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Strategy Steps */}
        {showsSteps && (
          <CardContent className="px-5">
            <ol className="text-foreground/80 space-y-4">
              {strategy.steps.map((s: string, i: number) => (
                <li className="flex items-center gap-1" key={i}>
                  <div
                    className={`flex min-h-7 min-w-7 items-center justify-center rounded-full ${clsx(
                      {
                        "text-success-500 bg-success-100": phase === "warmup",
                        "text-secondary-500 bg-secondary-100":
                          phase === "workout",
                        "text-accent-400 bg-accent-100": phase === "closer",
                      },
                    )}`}
                  >
                    <span>{i + 1}</span>
                  </div>

                  <p className="max-w-sm rounded-md p-3">{s}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        )}
        {children}
      </Card>
    );
  },
);

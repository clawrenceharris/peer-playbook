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
import { Strategy } from "@/features/strategies/domain";
import { cn } from "@/lib/utils";
import { getCardBackgroundColor, getCardIcon } from "@/utils";
import { Bookmark, ListRestart } from "lucide-react";
import clsx from "clsx";

export interface StrategyCardProps extends HTMLAttributes<HTMLDivElement> {
  strategy: Strategy | PlaybookStrategy;
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
      className="rounded-2xl border bg-card text-card-foreground shadow-lg p-4 opacity-90 transform-gpu"
    >
      <div
        className={`h-10 ${getCardBackgroundColor(phase)} rounded-md mb-3`}
      />
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded" />
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
    ref
  ) => {
    return (
      <Card
        ref={ref}
        onClick={onClick}
        className={cn(
          "p-0 relative rounded-2xl  shadow-md w-full",
          showsSteps ? "rounded-t-xl rounded-b-0" : "",
          className
        )}
        {...props}
      >
        <CardHeader
          className={cn(
            ` relative text-background items-center p-3 gap-3`,
            `${phase && getCardBackgroundColor(phase)}`,
            headerClassName
          )}
        >
          <div className="flex gap-4 items-center">
            <div className="icon-ghost bg-foreground/20 rounded-full flex items-center justify-center">
              {phase && getCardIcon(phase)}
            </div>
            <div className="w-full">
              <div>
                <CardTitle
                  title={strategy.title}
                  className="font-bold text-xl line-clamp-1"
                >
                  {strategy.title}
                </CardTitle>
                <span className="uppercase font-light text-background/70 text-sm">
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
                      className="rounded-full"
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
                      className="rounded-full"
                      variant={"ghost"}
                      size={"icon"}
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
                <li className="flex items-center gap-1 " key={i}>
                  <div
                    className={`text-pr min-w-7 min-h-7  rounded-full items-center justify-center flex ${clsx(
                      {
                        "text-success-500 bg-success-100": phase === "warmup",
                        "text-secondary-500 bg-secondary-100":
                          phase === "workout",
                        "text-accent-400 bg-accent-100": phase === "closer",
                      }
                    )}`}
                  >
                    <span>{i + 1}</span>
                  </div>

                  <p className="p-3 rounded-md max-w-sm">{s}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        )}
        {children}
      </Card>
    );
  }
);

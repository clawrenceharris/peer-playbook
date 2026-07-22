import React from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { Inbox } from "lucide-react";

/**
 * Available variants for empty state display
 */
export type EmptyVariant = "default" | "card" | "page" | "item";

export interface EmptyStateProps {
  /** The display variant - affects layout and styling */
  variant?: EmptyVariant;
  title?: string;
  message?: string;
  /** Custom icon to display (overrides default) */
  icon?: React.ReactNode;
  /** Text for the primary action button */
  actionLabel?: string;
  /** Callback for the primary action */
  onAction?: () => void;
  /** Text for the secondary action button */
  secondaryActionLabel?: string;
  /** Callback for the secondary action */
  onSecondaryAction?: () => void;
  /** Additional CSS classes to apply */
  className?: string;

  itemVariant?: "default" | "outline" | "muted";
}

export function EmptyState({
  variant = "default",
  title = "Nothing here yet.",
  message: message = "There are no items to display at the moment.",
  icon,
  itemVariant = "default",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  const renderActions = () => {
    if (!onAction && !onSecondaryAction) return null;

    return (
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        {onSecondaryAction && secondaryActionLabel && (
          <Button onClick={onSecondaryAction} variant="outline">
            {secondaryActionLabel}
          </Button>
        )}
        {onAction && actionLabel && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  };
  const renderPage = () => (
    <div className="gradient-background flex h-screen w-full items-center justify-center">
      {renderCard()}
    </div>
  );
  const renderItem = () => (
    <Item
      variant={itemVariant}
      className={cn("mx-auto w-full max-w-md", className)}
    >
      {icon && <ItemMedia>{icon}</ItemMedia>}
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {message && <ItemDescription>{message}</ItemDescription>}
      </ItemContent>
      <ItemActions>
        {onSecondaryAction && secondaryActionLabel && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
        {onAction && actionLabel && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </ItemActions>
    </Item>
  );

  const renderCard = () => (
    <Card
      className={cn(
        "flex w-full max-w-sm flex-col justify-center border py-4 text-center shadow-sm",
        className,
      )}
    >
      <CardHeader>
        <Inbox className="text-muted-foreground mx-auto mb-4 size-10" />
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {message && <CardDescription>{message}</CardDescription>}
      </CardContent>
      <CardFooter className="justify-end">
        <CardAction>{renderActions()}</CardAction>
      </CardFooter>
    </Card>
  );

  const renderDefault = () => (
    <div className={className}>
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        {icon && <div className="mb-4">{icon}</div>}
        <h3 className="text-foreground mb-2 text-xl font-semibold">{title}</h3>
        {message && (
          <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
        )}
        {renderActions()}
      </div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "card":
        return renderCard();
      case "page":
        return renderPage();

      case "item":
        return renderItem();
      case "default":
      default:
        return renderDefault();
    }
  };

  return renderVariant();
}

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
import Image from "next/image";

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
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onAction && actionLabel && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
        {onSecondaryAction && secondaryActionLabel && (
          <Button onClick={onSecondaryAction} variant="outline">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    );
  };
  const renderPage = () => (
    <div className="h-screen flex justify-center gradient-background w-full items-center">
      {renderCard()}
    </div>
  );
  const renderItem = () => (
    <Item
      variant={itemVariant}
      className={cn("max-w-md w-full mx-auto", className)}
    >
      {icon && <ItemMedia>{icon}</ItemMedia>}
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {message && <ItemDescription>{message}</ItemDescription>}
      </ItemContent>
      <ItemActions>
        {onAction && actionLabel && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
        {onSecondaryAction && secondaryActionLabel && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </ItemActions>
    </Item>
  );

  const renderCard = () => (
    <Card
      className={cn(
        "shadow-sm border max-w-sm w-full  flex flex-col justify-center text-center",
        className,
      )}
    >
      <CardHeader>
        <Image
          width={510}
          height={510}
          className="w-full max-w-[200px] mx-auto"
          alt="Sad Notebook"
          src="/images/error.png"
        />
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
      <div className="flex flex-col w-full items-center justify-center px-4 text-center">
        {icon && <div className="mb-4">{icon}</div>}
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
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

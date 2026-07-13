"use client";
import { cn } from "@/lib/utils";
import { ContentHeader } from "./content-header";
import React from "react";
import { ScrollArea, ScrollBar } from "../ui";

type ContentLayoutProps = {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  canGoBack?: boolean;
  onBack?: () => void;
  className?: string;
  showHeader?: boolean;
  contentContainerClassName?: string;
  scrollAreaClassName?: string;
  showThemeToggle?: boolean;
  headerRight?: React.ReactNode;
  headerClassName?: string;
  showSearch?: boolean;
  showUserNav?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "title">;

export const ContentLayout = React.forwardRef<
  HTMLDivElement,
  ContentLayoutProps
>(
  (
    {
      title,
      children,
      onBack,
      showSearch = true,
      canGoBack = false,
      className,
      showHeader = true,
      contentContainerClassName,
      headerRight,
      headerClassName,
      scrollAreaClassName,
      showThemeToggle = true,
      showUserNav = true,
      ...props
    }: ContentLayoutProps,
    ref,
  ) => {
    return (
      <div
        className={cn("flex h-full w-full flex-1 flex-col", className)}
        {...props}
      >
        {showHeader && (
          <ContentHeader
            showSearch={showSearch}
            title={title}
            showUserNav={showUserNav}
            canGoBack={canGoBack}
            onBack={onBack}
            headerRight={headerRight}
            className={headerClassName}
            showThemeToggle={showThemeToggle}
          />
        )}

        <ScrollArea
          ref={ref}
          className={cn(
            "mx-auto flex h-full min-h-0 w-full max-w-[1200px]",
            scrollAreaClassName,
          )}
        >
          <div
            className={cn(
              "flex min-h-full flex-1 flex-col p-5",
              contentContainerClassName,
            )}
          >
            {children}
          </div>
        </ScrollArea>
      </div>
    );
  },
);

ContentLayout.displayName = "ContentLayout";

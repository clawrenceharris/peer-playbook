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
  secondaryHeader?: React.ReactNode;
  secondaryHeaderClassName?: string;
  scrollable?: boolean;
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
      scrollable = true,
      headerClassName,
      scrollAreaClassName,
      showThemeToggle = true,
      showUserNav = true,
      secondaryHeader,
      secondaryHeaderClassName,
      ...props
    }: ContentLayoutProps,
    ref,
  ) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          "flex h-full w-full flex-1 flex-col overflow-hidden",
          className,
        )}
      >
        {showHeader && (
          <ContentHeader
            secondaryHeader={secondaryHeader}
            showSearch={showSearch}
            title={title}
            showUserNav={showUserNav}
            canGoBack={canGoBack}
            onBack={onBack}
            secondaryHeaderClassName={secondaryHeaderClassName}

            headerRight={headerRight}
            className={headerClassName}
            showThemeToggle={showThemeToggle}
          />
        )}

        <div
          className={cn(
            "container mx-auto flex flex-1 flex-col px-5 pt-20 pb-5",
            scrollable ? "overflow-y-auto" : "overflow-hidden",
            contentContainerClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);

ContentLayout.displayName = "ContentLayout";

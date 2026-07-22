"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks";
import { SheetMenu, UserNav } from "./";
import { useStore } from "zustand";
import { useSidebar } from "@/store";
import { useSidebar as useLibrarySidebar } from "@/components/ui";

interface NavbarProps {
  title?: string | React.ReactNode;
  canGoBack?: boolean;
  onBack?: () => void;
  headerRight?: React.ReactNode;
  className?: string;
  showThemeToggle?: boolean;
  showSearch?: boolean;
  showUserNav?: boolean;
  secondaryHeader?: React.ReactNode;
  secondaryHeaderClassName?: string;
}
export function ContentHeader({
  title,
  canGoBack = false,
  onBack,
  headerRight,
  className,
  showUserNav = true,
  secondaryHeader,
  secondaryHeaderClassName,
}: NavbarProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { open: isLibraryOpen } = useLibrarySidebar();
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const {
    isOpen,
    settings: { disabled },
  } = sidebar;
  return (
    <header
      className={cn(
        "bg-surface fixed top-0 left-0 z-9 min-h-17 w-full gap-3 border-b",
        isLibraryOpen
          ? "pl-[calc(var(--sidebar-width-collapsed)+var(--library-sidebar-width))]"
          : isOpen
            ? "pl-(--sidebar-width)"
            : disabled
              ? "pl-0"
              : "pl-(--sidebar-width-collapsed)",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3",
        )}
      >
        {isMobile && <SheetMenu />}
        <div className="flex h-full w-full items-center gap-6">
          {canGoBack && (
            <Button
              size="icon-sm"
              aria-label="Go back"
              variant="outline"
              onClick={onBack ?? (() => router.back())}
            >
              <ChevronLeft strokeWidth={3} />
            </Button>
          )}
          {title &&
            (typeof title === "string" ? (
              <h1 title={title} className="line-clamp-1 text-xl font-bold">
                {title}
              </h1>
            ) : (
              title
            ))}
        </div>
        <div className="flex items-center gap-4">
          {headerRight && <div className="flex-1">{headerRight}</div>}
          {showUserNav && <UserNav />}
        </div>
      </div>

      {secondaryHeader && (
        <div
          className={cn(
            "secondary-header border-t px-4",
            secondaryHeaderClassName,
          )}
        >
          {secondaryHeader}
        </div>
      )}
    </header>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks";
import { SheetMenu, UserNav } from "./";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui";
import { Playbook, Session } from "../icons";

interface NavbarProps {
  title?: string | React.ReactNode;
  canGoBack?: boolean;
  onBack?: () => void;
  headerRight?: React.ReactNode;
  className?: string;
  showThemeToggle?: boolean;
  showSearch?: boolean;
  showUserNav?: boolean;
}
export function ContentHeader({
  title,
  canGoBack = false,
  onBack,
  headerRight,
  className,
  showUserNav = true,
}: NavbarProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  return (
    <header
      className={cn(
        "bg-surface sticky top-0 z-50 flex min-h-17 w-full flex-1 items-center justify-between gap-3 border-b px-5 py-3",
        className,
      )}
    >
      <div className={cn("flex w-full items-center justify-between gap-3")}>
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
      </div>
      {showUserNav && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              className="rounded-full"
              aria-label="Create new"
              size="icon-lg"
              variant="primary"
            >
              <Plus strokeWidth={2.5} className="size-7" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="divide-y p-0">
            <DropdownMenuItem
              onClick={() => router.push("/playbooks/create")}
              className="focus:bg-muted-foreground/20 rounded-none"
            >
              <Playbook />
              Playbook
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/sessions")}
              className="focus:bg-muted-foreground/20 rounded-none"
            >
              <Session />
              Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {headerRight && <div className="flex-1">{headerRight}</div>}
      {showUserNav && <UserNav />}
    </header>
  );
}

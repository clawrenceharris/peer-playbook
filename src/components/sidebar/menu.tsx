"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  return (
    <nav className="flex h-full w-full flex-1 flex-col justify-between">
      <ul className="flex flex-col justify-between space-y-1">
        {menuList.map(({ groupLabel, menus }, index) => (
          <li
            className={cn(
              "w-full",
              groupLabel ? "border-sidebar-border border-t-2 pt-5" : "",
            )}
            key={index}
          >
            {(isOpen && groupLabel) || isOpen === undefined ? (
              <p className="text-muted-foreground max-w-[248px] truncate px-4 pb-2 text-sm font-medium">
                {groupLabel}
              </p>
            ) : !isOpen && isOpen !== undefined && groupLabel ? (
              <div>
                <p className={cn(!isOpen ? "hidden" : "")}>{groupLabel}</p>
              </div>
            ) : null}
            {menus.map(
              ({ href, label, icon: Icon, active, tooltip }, index) => (
                <div className="w-full" key={index}>
                  <div
                    className={cn("mb-5 flex flex-col items-center gap-1.5")}
                  >
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant={
                              (active === undefined &&
                                pathname.startsWith(href)) ||
                              active
                                ? "secondary"
                                : "ghost"
                            }
                            className={cn(
                              "hover:bg-muted-foreground/8 text-sidebar-foreground [&_svg]:stroke-sidebar-foreground w-full justify-start overflow-visible py-5 font-semibold transition-none",
                              isOpen
                                ? "flex-row"
                                : "size-8 flex-col items-center justify-center rounded-[8px] p-0",
                              (active === undefined &&
                                pathname.startsWith(href)) ||
                                active
                                ? "bg-surface hover:bg-surface/80 text-primary [&_svg]:stroke-primary [&_svg]:fill-primary border shadow-xs"
                                : "",
                            )}
                            asChild
                          >
                            <Link href={href}>
                              <span
                                className={cn(isOpen === false ? "" : "mr-4")}
                              >
                                <Icon
                                  className={cn(
                                    isOpen ? "size-5.5" : "size-4.5",
                                  )}
                                />
                              </span>
                              <p className={cn(!isOpen ? "hidden" : "")}>
                                {label}
                              </p>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {!isOpen && tooltip && (
                          <TooltipContent side="right">{label}</TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    {!isOpen && !tooltip && (
                      <p className={cn("text-sidebar-foreground text-[11px]")}>
                        {label}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

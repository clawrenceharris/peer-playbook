"use client";

import Link from "next/link";
import { Ellipsis, LogOut, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useAuth } from "../providers/auth-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui";
import { useUser } from "../providers";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const { signOut } = useAuth();
  const { profile, user } = useUser();
  return (
    <nav className="flex h-full w-full flex-1 flex-col justify-between pt-20">
      <ul className="flex flex-col justify-between space-y-1">
        {menuList.map(({ groupLabel, menus }, index) => (
          <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
            {(isOpen && groupLabel) || isOpen === undefined ? (
              <p className="text-muted-foreground max-w-[248px] truncate px-4 pb-2 text-sm font-medium">
                {groupLabel}
              </p>
            ) : !isOpen && isOpen !== undefined && groupLabel ? (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="w-full">
                    <div className="flex w-full items-center justify-center">
                      <Ellipsis className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{groupLabel}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="pb-2"></p>
            )}
            {menus.map(({ href, label, icon: Icon, active }, index) => (
              <div className="w-full" key={index}>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={
                          (active === undefined && pathname.startsWith(href)) ||
                          active
                            ? "secondary"
                            : "ghost"
                        }
                        className={cn(
                          "text-foreground/60 hover:bg-muted-foreground/13 [&_svg]:stroke-foreground/60 mb-2 w-full justify-start py-5 font-semibold transition-none [&_svg]:stroke-[2.4px]",

                          (active === undefined && pathname.startsWith(href)) ||
                            active
                            ? "bg-surface text-primary [&_svg]:stroke-primary [&_svg]:fill-primary border shadow-xs"
                            : "hover:text-foreground/60",
                        )}
                        asChild
                      >
                        <Link href={href}>
                          <span className={cn(isOpen === false ? "" : "mr-4")}>
                            <Icon className="size-5.5" />
                          </span>
                          <p
                            className={cn(
                              "max-w-[200px] truncate",
                              isOpen === false
                                ? "-translate-x-96 opacity-0"
                                : "translate-x-0 opacity-100",
                            )}
                          >
                            {label}
                          </p>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    {isOpen === false && (
                      <TooltipContent side="right">{label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </li>
        ))}
      </ul>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="shadow-x w-full space-y-2 overflow-hidden rounded-lg border px-4 py-3 text-left">
            <div className="flex w-full items-center gap-2">
              <Avatar>
                <AvatarImage src={profile.avatarUrl ?? undefined} />
                <AvatarFallback>
                  {profile.firstName.charAt(0).toUpperCase()}
                  {profile.lastName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn("flex w-full flex-col", !isOpen && "hidden")}>
                <p className="text-sm font-semibold">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-muted-foreground max-w-[110px] truncate text-xs wrap-break-word">
                  {user.email}
                </p>
              </div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

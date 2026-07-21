"use client";

import Link from "next/link";
import { Home, LogOut, PieChart, Plus, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useUser } from "../providers";
import { useRouter } from "next/navigation";
import { Playbook } from "../icons";

export function UserNav() {
  const { user, profile } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
            <PieChart />
            Session
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full"
            asChild
          >
            <Avatar className="border-secondary border-2">
              <AvatarImage src={profile?.avatarUrl ?? undefined} alt="Avatar" />
              <AvatarFallback>
                {profile.displayName?.charAt(0).toUpperCase() ??
                  profile.username.charAt(0).toUpperCase() ??
                  ""}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {profile.displayName ?? profile.username}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href="/home" className="flex items-center">
                <Home
                  strokeWidth={3}
                  className="text-muted-foreground mr-3 h-4 w-4"
                />
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href={`/user/${user.id}`} className="flex items-center">
                <User
                  strokeWidth={3}
                  className="text-muted-foreground mr-3 h-4 w-4"
                />
                My Profile
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer" onClick={signOut}>
            <LogOut
              strokeWidth={3}
              className="text-muted-foreground mr-3 h-4 w-4"
            />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/features/auth/presentation/hooks";
import { PROFILE_MODAL_TYPES } from "@/features/profile/presentation/components/modals";
import { useUpdateProfileForm } from "@/features/profile/presentation/hooks";
import { useModal, useUser } from "@/components/providers";
import { Session } from "../icons/session";
import { Playbook } from "../icons/playbook";
import { Home } from "../icons/home";
import { assets } from "@/lib/constants";

const items: {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
}[] = [
  {
    title: "Home",
    href: "/home",
    icon: Home,
    isActive: (pathname) => pathname === "/home",
  },

  {
    title: "Library",
    href: "/library/playbooks",
    icon: Playbook,
    isActive: (pathname) => pathname.startsWith("/library"),
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: Session,
    isActive: (pathname) => pathname.startsWith("/sessions"),
  },
];
export function AppSidebar() {
  const pathname = usePathname();
  const { profile, user } = useUser();
  const { isMobile } = useSidebar();
  const { signOut } = useAuth();
  const { openModal } = useModal();
  const { updateProfile } = useUpdateProfileForm(profile);
  const handleProfileClick = () => {
    if (!user?.id) return;
    openModal(PROFILE_MODAL_TYPES.UPDATE, {
      profileId: user.id,
      onConfirm: async (data) => {
        await updateProfile({
          id: user.id,
          email: user.email,
          ...data,
        });
      },
    });
  };
  return (
    <Sidebar
      collapsible="none"
      className="fixed top-0 left-0 flex h-screen flex-col border-none py-3 transition-all duration-300"
    >
      <SidebarHeader className="flex items-center">
        <Image
          onClick={() => {
            window.location.href = "/";
          }}
          src={assets.logo}
          priority
          alt="PeerPlaybook logo"
          width={833}
          height={167}
          className="h-auto w-full max-w-15 cursor-pointer"
        />
      </SidebarHeader>

      <SidebarContent className="justify-center">
        <SidebarMenu className="flex flex-col items-center gap-6">
          {items.map(({ title, isActive, href, icon: Icon }) => {
            return (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "text-foreground/60 [&_path]:stroke-foreground/60 flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    "hover:bg-muted",
                    isMobile ? "size-15" : "size-24",
                    isActive(pathname)
                      ? "bg-surface text-primary-400 [&_path]:stroke-primary-400 border font-semibold shadow-sm"
                      : "",
                  )}
                >
                  <Link href={href}>
                    <Icon className="min-h-[25px] min-w-[25px] transition-transform" />
                    {!isMobile && (
                      <span className="hidden md:inline">{title}</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer / Profile */}

      <SidebarFooter className="flex items-center px-3 py-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="to-primary-400 from-primary-800 border-primary-500 flex size-12 shrink-0 items-center justify-center rounded-full border bg-linear-to-tl font-semibold text-white shadow-md shadow-black/40 transition-all duration-300 hover:scale-105">
            {`${profile.firstName?.charAt(0)}${profile.lastName?.charAt(0)}`}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={handleProfileClick}>
              <User /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppSidebarSkeleton() {
  return (
    <Sidebar
      collapsible="none"
      className="fixed top-0 left-0 flex h-screen flex-col border-none bg-gray-800 transition-all duration-300"
    ></Sidebar>
  );
}

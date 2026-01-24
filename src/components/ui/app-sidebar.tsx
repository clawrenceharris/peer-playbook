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
import { useAuth } from "@/features/auth/hooks";
import { PROFILE_MODAL_TYPES } from "@/features/profile/components/modals";
import { useUpdateProfile } from "@/features/profile/hooks/use-profile-mutations";
import { useModal, useUser } from "@/app/providers";
import { Session } from "../icons/session";
import { Playbook } from "../icons/playbook";
import { Home } from "../icons/home";

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
  const { mutateAsync: handleUpdateProfile } = useUpdateProfile();
  const handleProfileClick = () => {
    if (!user?.id) return;
    openModal(PROFILE_MODAL_TYPES.UPDATE, {
      profileId: user.id,
      onConfirm: async (data) => {
        await handleUpdateProfile({
          id: user.id,
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        });
      },
    });
  };
  return (
    <Sidebar
      collapsible="none"
      className="flex fixed left-0 top-0 flex-col h-screen border-none bg-gray-800 transition-all duration-300"
    >
      <SidebarHeader className="flex items-center">
        <Image
          onClick={() => {
            window.location.href = "/";
          }}
          src="/images/logo.png"
          priority
          alt="MySI Logo"
          width={90}
          height={90}
          className="cursor-pointer"
        />
      </SidebarHeader>

      <SidebarContent className="justify-center">
        <SidebarMenu className="flex flex-col gap-6 items-center">
          {items.map(({ title, isActive, href, icon: Icon }) => {
            return (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex justify-center flex-col text-white [&_path]:stroke-white  items-center gap-3 px-4 py-5 rounded-xl text-sm font-medium transition-all",
                    "hover:bg-gray-700/40",
                    isMobile ? "size-15" : "size-24",
                    isActive(pathname)
                      ? "bg-gray-700/40 text-primary-400 [&_path]:stroke-primary-400 font-semibold"
                      : "",
                  )}
                >
                  <Link href={href}>
                    <Icon className="min-w-[25px] min-h-[25px] transition-transform" />
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

      <SidebarFooter className="px-3 py-5 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="
              flex items-center justify-center
              transition-all duration-300
               size-12 rounded-full bg-linear-to-tl to-primary-400 from-primary-800 text-white font-semibold shrink-0
              border-primary-500 border shadow-md shadow-black/40 hover:scale-105
            "
          >
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
      className="flex fixed left-0 top-0 flex-col h-screen border-none bg-gray-800 transition-all duration-300"
    ></Sidebar>
  );
}

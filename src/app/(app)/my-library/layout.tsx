"use client";
import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Playbook } from "@/components/icons";
import { Bookmark, Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "zustand";
import { useSidebar } from "@/store";

const items: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
}[] = [
  {
    label: "My Playbooks",
    href: "/my-library/playbooks",
    icon: Playbook,
    isActive: (pathname) => pathname.startsWith("/my-library/playbooks"),
  },
  {
    label: "My Strategies",
    href: "/my-library/strategies",
    icon: Brain,
    isActive: (pathname) => pathname.startsWith("/my-library/strategies"),
  },
  {
    label: "Bookmarks",
    href: "/my-library/bookmarks",
    icon: Bookmark,
    isActive: (pathname) => pathname.startsWith("/my-library/bookmarks"),
  },
];

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;

  const { isOpen } = sidebar;
  return (
    <>
      <Sidebar
        className={cn("left-32 border-l", isOpen ? "left-[95px]" : "w-[16rem]")}
      >
        <SidebarHeader className="px-3 pt-6">
          <span className="text-xl font-semibold">Library</span>
        </SidebarHeader>
        <SidebarContent className="px-3 py-5">
          <SidebarMenu className="flex flex-col items-start gap-3">
            {items.map(({ label, href, isActive, icon: Icon }) => {
              return (
                <SidebarMenuItem className="w-full" key={label}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-foreground/80 [&_svg]:stroke-foreground/80 flex h-10 items-center justify-start rounded-md p-4 text-sm font-normal transition-all",
                      "hover:bg-muted-foreground/10",
                      isActive(pathname)
                        ? "bg-primary-foreground text-primary-400 [&_path]:stroke-primary-400 border font-semibold"
                        : "",
                    )}
                  >
                    <Link href={href}>
                      <Icon className="min-h-[25px] min-w-[25px] transition-transform" />
                      {isOpen && (
                        <span className="hidden md:inline">{label}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main>{children}</main>
    </>
  );
}

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
  useSidebar,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Playbook } from "@/components/icons";
import { Bookmark, Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
}[] = [
  {
    label: "My Playbooks",
    href: "/library/playbooks",
    icon: Playbook,
    isActive: (pathname) => pathname.startsWith("/library/playbooks"),
  },
  {
    label: "My Strategies",
    href: "/library/strategies",
    icon: Brain,
    isActive: (pathname) => pathname.startsWith("/library/strategies"),
  },
  {
    label: "Bookmarks",
    href: "/library/bookmarks",
    icon: Bookmark,
    isActive: (pathname) => pathname.startsWith("/library/bookmarks"),
  },
];

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "14rem",
          } as React.CSSProperties
        }
      >
        <Sidebar className="left-32 py-5 px-3">
          <SidebarHeader>
            <span className="text-xl font-semibold">Library</span>
          </SidebarHeader>
          <SidebarContent className="mt-4">
            <SidebarMenu className="flex flex-col gap-3  items-start">
              {items.map(({ label, href, isActive, icon: Icon }) => {
                return (
                  <SidebarMenuItem className="w-full" key={label}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex justify-start text-foreground items-center p-4 h-10 rounded-md text-sm font-normal transition-all",
                        "hover:bg-muted",
                        isActive(pathname)
                          ? "bg-primary-foreground border text-primary-400 [&_path]:stroke-primary-400 font-semibold"
                          : "",
                      )}
                    >
                      <Link href={href}>
                        <Icon className="min-w-[25px] min-h-[25px] transition-transform" />
                        {!isMobile && (
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
      </SidebarProvider>
    </>
  );
}

"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Playbook } from "@/components/icons";
import { Bookmark, Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PlaybooksPage from "./_components/PlaybooksPage";
import { PlaybooksPageOutput } from "@/features/playbooks/application/dto/PlaybooksPageDTO";
import { PlaybooksPageSkeleton } from "@/features/playbooks/presentation/components";
import { useEffect, useRef, useState } from "react";

const menuItems: {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
}[] = [
  {
    id: "playbooks",
    label: "My Playbooks",
    href: "/my-library/playbooks",
    icon: Playbook,
    isActive: (pathname) => pathname.startsWith("/my-library/playbooks"),
  },
  {
    id: "strategies",
    label: "My Strategies",
    href: "/my-library/strategies",
    icon: Brain,
    isActive: (pathname) => pathname.startsWith("/my-library/strategies"),
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    href: "/my-library/bookmarks",
    icon: Bookmark,
    isActive: (pathname) => pathname.startsWith("/my-library/bookmarks"),
  },
];

type LibraryPageClientProps = {
  playbooksPage: PlaybooksPageOutput;
};

export function LibraryPageClient({ playbooksPage }: LibraryPageClientProps) {
  const pathname = usePathname();

  const activePath = menuItems.find((item) => item.isActive(pathname));
  const activePathId = activePath?.id ?? "playbooks";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSidebarOpen(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);
  if (!playbooksPage) return <PlaybooksPageSkeleton />;
  return (
    <>
      <Sidebar
        className={cn(
          "bg-library-sidebar left-0 w-0 transition-all duration-200 ease-in-out",
          sidebarOpen &&
            "left-(--sidebar-width-collapsed) w-(--library-sidebar-width)",
        )}
      >
        <SidebarHeader className="px-3 pt-6">
          <span className="text-xl font-semibold">Library</span>
        </SidebarHeader>
        <SidebarContent className="px-3 py-5">
          <SidebarMenu className="flex flex-col items-start gap-3">
            {menuItems.map(({ id, label, href, isActive, icon: Icon }) => {
              return (
                <SidebarMenuItem className="w-full" key={id}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-foreground/80 [&_svg]:stroke-foreground/80 flex h-10 items-center justify-start rounded-md p-4 text-sm font-normal transition-all",
                      "hover:bg-muted-foreground/10",
                      isActive(pathname)
                        ? "bg-primary-foreground text-primary hover:text-primary [&_path]:stroke-primary-400 border font-semibold shadow-xs"
                        : "",
                    )}
                  >
                    <Link href={href}>
                      <Icon className="min-h-[25px] min-w-[25px] transition-transform" />
                      <span className="hidden md:inline">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="h-full pl-[calc(var(--library-sidebar-width))]">
        {activePathId === "playbooks" && <PlaybooksPage page={playbooksPage} />}
        {/* {activePathId === "strategies" && <StrategiesPage />}
        {activePathId === "bookmarks" && <BookmarksPage />} */}
      </div>
    </>
  );
}

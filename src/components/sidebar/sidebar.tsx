"use client";
import { Menu, SidebarToggle } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store/use-sidebar";
import { useStore } from "@/store/use-store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/constants";
import { useSidebar as useLibrarySidebar } from "@/components/ui";
export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  const { open } = useLibrarySidebar();
  if (!sidebar) return null;
  const { getOpenState, setIsHover, toggleOpen, settings } = sidebar;
  return (
    <aside
      className={cn(
        "bg-sidebar fixed top-0 left-0 z-50 flex h-screen -translate-x-full flex-col justify-center py-4 transition-[width] duration-300 ease-in-out md:translate-x-0",
        !getOpenState() || open ? "w-[95px]" : "w-[16rem]",
        settings.disabled && "hidden",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between pr-3",
          !getOpenState() || open ? "justify-center px-3" : "justify-between",
        )}
      >
        {getOpenState() && !open && (
          <Button
            className={cn("mb-1 transition-opacity duration-300 ease-in-out")}
            variant="link"
            asChild
          >
            <Link href="/home" className="relative">
              <Image
                src={assets.logo}
                className="h-auto w-full max-w-10"
                alt="Logo"
                width={300}
                height={300}
              />
            </Link>
          </Button>
        )}
        <SidebarToggle onToggle={toggleOpen} />
      </div>

      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative flex h-full w-full flex-col overflow-y-auto px-3"
      >
        <Menu isOpen={getOpenState() && !open} />
      </div>
    </aside>
  );
}

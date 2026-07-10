"use client";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Suspense } from "react";
import { useStore } from "@/store/use-store";
import { useSidebar } from "@/store/use-sidebar";
import { Loader2 } from "lucide-react";
import { SidebarProvider } from "../ui/sidebar";
import { UserProvider } from "../providers";
import { usePathname } from "next/navigation";

type SidebarLayoutProps = {
  children: React.ReactNode;
};
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const sidebar = useStore(useSidebar, (x) => x);
  const pathname = usePathname();
  const isLibraryOpen = pathname.startsWith("/my-library");
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <UserProvider>
      <SidebarProvider
        open={pathname.startsWith("/my-library")}
        style={
          {
            "--sidebar-width": "14rem",
          } as React.CSSProperties
        }
      >
        <Sidebar />
        <main
          className={cn(
            "transition-[padding-left] duration-300 ease-in-out",
            !getOpenState(isLibraryOpen)
              ? "md:pl-(--sidebar-width-collapsed)"
              : "md:pl-(--sidebar-width)",
            settings.disabled ? "md:pl-0" : "",
          )}
        >
          <Suspense
            fallback={
              <Loader2
                className="text-primary size-13 animate-spin"
                strokeWidth={2.5}
              />
            }
          >
            {children}
          </Suspense>
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}

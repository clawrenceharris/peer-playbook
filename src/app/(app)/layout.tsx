import React from "react";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { UserProvider } from "@/app/providers";
import { SidebarProvider } from "@/components/ui";

export default function Layout({ children }) {
  return (
    <UserProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "8rem",
            "--sidebar-width-mobile": "5rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <main className="ml-32">{children}</main>
      </SidebarProvider>
    </UserProvider>
  );
}

import React from "react";
import { UserProvider } from "@/components/providers";
import { SidebarLayout } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui";

export default function AppLayout({ children }) {
  return (
    <UserProvider>
      <SidebarLayout>{children}</SidebarLayout>
    </UserProvider>
  );
}

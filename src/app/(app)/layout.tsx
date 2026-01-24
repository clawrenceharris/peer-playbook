import { AppSidebar } from "@/components/ui/app-sidebar";
import { UserProvider } from "@/app/providers";
import React, { Suspense } from "react";
import { SidebarMenuSkeleton, SidebarProvider } from "@/components/ui";
import { AppSkeleton } from "@/components/ui/app-skeleton";

export default function Layout({
  children,
}){
  return(
      <UserProvider>
     

     
      <SidebarProvider style={{
        "--sidebar-width": "8rem",
        "--sidebar-width-mobile": "5rem"
      }as React.CSSProperties}>
        <Suspense fallback={
          <>
            <SidebarMenuSkeleton />
            <div className="ml-32"><AppSkeleton/></div>
          </>
        }>
        <AppSidebar/>
      <main className="ml-32">{children}</main>
      </Suspense>
      </SidebarProvider>
     
      </UserProvider>
    
   
      
  );
}

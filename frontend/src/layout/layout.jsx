import { AppSidebar } from "@/components/custom/app-sidebar";
import DashboardBreadCrumb from "@/components/custom/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>  
        <div className="flex flex-col h-screen">
          <header className="flex w-full h-16 shrink-0 items-center gap-2 border-b px-4 bg-accent/5">
            <div className="flex w-full items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DashboardBreadCrumb />
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;

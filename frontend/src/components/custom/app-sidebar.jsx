"use client";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchForm } from "./search-form";
import { data } from "@/constants/data";

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border/10">
        <Link to="/">
          <div className="flex gap-2 font-semibold text-lg items-end leading-none p-2">
            <img src="/logo.png" alt="Logo" className="h-6" />
            <span className="text-white">Blowup</span>
          </div>
        </Link>

        {/* search form */}
        {/* <SearchForm /> */}
      </SidebarHeader>

      {/* Make content non-scrollable */}
      <SidebarContent className="overflow-hidden ">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            {/* <SidebarGroupLabel className="text-white/70 font-medium">
              {item.title}
            </SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="text-white/90 hover:text-white transition-colors"
                    >
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

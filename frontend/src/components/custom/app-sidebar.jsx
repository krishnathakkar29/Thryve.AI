import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { data } from "@/constants/data";
import usermail from "../../gif/usermail.png";
import setting from "../../gif/settings.png";

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props} className="bg-[#0D578C] text-white rounded-r-xl h-screen w-64">
      {/* User Profile Section */}
      <SidebarHeader className="p-4 mb-4">
        <Link to="/">
          <div className="flex items-center space-x-2">
            <img src={usermail} alt="User" className="h-10 w-10 rounded-full" />
            <div>
              <div className="text-sm font-medium">full name</div>
              <div className="text-xs text-gray-300">emailid@gmail.com</div>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Menu with increased gap */}
      <SidebarContent className="p-2 flex flex-col space-y-4">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.url}>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-4">
                {item.items.map((menuItem) => (
                  <SidebarMenuItem key={menuItem.title}>
                    <SidebarMenuButton
                      asChild
                      className="flex items-center space-x-3 w-full p-2 rounded-lg transition-all hover:bg-blue-700"
                    >
                      <Link to={menuItem.url} className="flex items-center space-x-3">
                        <img 
                          src={menuItem.img} 
                          alt={menuItem.title} 
                          className={`h-7 ${menuItem.title.toLowerCase().includes('file') ? 'w-5 ml-1' : 'w-7'} ${menuItem.title.toLowerCase().includes('tech support') ? 'w-9 h-9  relative right-1' : ''}`} 
                        />
                        <span className={`${menuItem.title.toLowerCase().includes('tech support') ? 'relative right-3' : ''}`}>{menuItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Settings Button */}
      <div className="absolute bottom-4 w-full px-4">
        <Link to="/settings">
          <button className="flex items-center space-x-3 w-full p-2 hover:bg-blue-700 rounded-lg">
            <img src={setting} alt="Settings" className="h-8 w-8" />
            <span>Settings</span>
          </button>
        </Link>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
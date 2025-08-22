import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LineChart,
  Users,
  ClipboardList,
  Map,
  Menu,
} from "lucide-react";
import { useState, memo } from "react";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Simulation", path: "/simulation", icon: LineChart },
  { name: "Drivers", path: "/drivers", icon: Users },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Routes", path: "/routes", icon: Map },
];

const NavItem = memo(({ name, path, Icon, isCollapsed, isActive }: any) => {
  return (
    <div className="relative group">
      <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
          ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "hover:bg-gray-100"
          }
        `}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span
          className={`transition-opacity duration-300 ease-in-out ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          {name}
        </span>
      </Link>
      {isCollapsed && (
        <span
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3
          whitespace-nowrap bg-gray-800 text-white text-sm
          rounded-md px-3 py-2 opacity-0 group-hover:opacity-100
          transition-opacity duration-300 ease-in-out
          z-50 shadow-lg pointer-events-none"
        >
          {name}
        </span>
      )}
    </div>
  );
});

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.username);
  const navigate = useNavigate();
  const handleLogout=async()=>{
    try{
      await authApi.logout();
      logout();
      navigate('/login');
    }catch(err){
      console.log("Logout Failed",err);
    }
  };

  return (
    <aside
      className={`bg-white shadow-md h-screen p-4 flex flex-col
        transition-all duration-300
        ${isCollapsed ? "w-20" : "w-56"}
      `}
    >
      <div
        className={`mb-4 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && ( <h1 className="text-2xl font-bold whitespace-nowrap">G</h1> )}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={`
            p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors
            ${isCollapsed ? "flex justify-center" : ""}
          `}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col space-y-2 flex-1">
        {navItems.map(({ name, path, icon }) => (
          <NavItem
            key={path}
            name={name}
            path={path}
            Icon={icon}
            isCollapsed={isCollapsed}
            isActive={location.pathname.startsWith(path)}
          />
        ))}
      </nav>
      {!isCollapsed && (
        <div className="flex flex-col gap-y-4 items-center">
          {/* Center the username but don't shrink the button */}
          <div className="flex flex-col items-center w-full">
            <span className="text-xl">{`${username}`||"Manager"}</span>
          </div>
          <div className="w-full flex justify-center">
            <Button
              variant={"destructive"}
              size="sm"
              onClick={handleLogout}
              className="cursor-pointer w-full"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;

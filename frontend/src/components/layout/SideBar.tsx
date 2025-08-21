import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LineChart,
  Users,
  ClipboardList,
  Map,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Simulation", path: "/simulation", icon: LineChart },
  { name: "Drivers", path: "/drivers", icon: Users },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Routes", path: "/routes", icon: Map },
];

const  Sidebar=()=> {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Fleet Manager</h1>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
export default Sidebar;

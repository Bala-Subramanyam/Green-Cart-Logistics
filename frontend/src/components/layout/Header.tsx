import { Button } from "../ui/button";
import { useAuthStore } from "@/store/authStore";
import { LogOut } from "lucide-react";
import { authApi } from "@/api/authApi";

const Header=()=>{
    const username=useAuthStore((state)=>state.username);
    const logout=useAuthStore((state)=>state.logout);
    

    const handleLogout=async ()=>{
        authApi.logout();
        logout();
        window.location.href='/login';
    };

    return(
        <header className="flex justify-between items-center p-4 border-b bg-background">
      <h1 className="text-xl font-bold tracking-tight">Logistics Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Hello, {username}</span>
        <Button variant="destructive" size="sm" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" /> Logout
        </Button>
      </div>
    </header>
    )
}
export default Header;
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
      
    </header>
    )
}
export default Header;

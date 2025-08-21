import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Header from "./Header";

const MainLayout=()=>{
    return(
        <div className="flex h-screen bg-background">
            <Sidebar/>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet/>
                </main>
        </div>
    )
}

export default MainLayout
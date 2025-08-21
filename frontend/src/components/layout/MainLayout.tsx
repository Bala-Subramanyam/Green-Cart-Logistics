import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Header from "./Header";

const MainLayout=()=>{
    return(
        <div className="flex h-screen bg-background">
            <Sidebar/>
            <div className="flex flex-col flex-1">
                <Header/>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}

export default MainLayout;
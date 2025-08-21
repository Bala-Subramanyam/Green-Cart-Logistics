import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import MainLayout from './MainLayout';

const ProtectedLayout=()=>{
    const isAuthenticated = useAuthStore((state)=>state.isAuthenticated);
    const loading=useAuthStore((state)=>state.isLoading);

    if(loading) return <p>Loading...</p>
    if(!isAuthenticated) return <Navigate to='/login'/>

    return(
        <MainLayout/>
    )
}
export default ProtectedLayout;
import { useAuthStore } from "../store/authStore"


export default function DashboardPage(){
    const username=useAuthStore((state)=>state.username);
    
    return(
        <>
        <h1>HELLO THERE {username}</h1>
        </>
    )
}
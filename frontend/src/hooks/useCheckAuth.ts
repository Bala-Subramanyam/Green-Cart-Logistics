import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

export default function useCheckAuth(){
    const setAuthenticate=useAuthStore((state)=>state.setAuthenticate);
    const setUsername=useAuthStore((state)=>state.setUsername)
    const setLoading=useAuthStore((state)=>state.setLoading);
    useEffect(()=>{
        axios.get("http://localhost:3000/api/auth/me",{withCredentials:true})
        .then((res:any)=>{
            setAuthenticate(res.data.value);
            setUsername(res.data.user);
        }).catch(()=>{setAuthenticate(false)}).finally(()=>{setLoading(false)});
    },[]);
}
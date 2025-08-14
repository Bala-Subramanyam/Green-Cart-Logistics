import {create} from 'zustand';

interface AuthState{
    
    isAuthenticated:boolean;
    username:string | null;
    isLoading:boolean;

    setUsername:(name:string)=>void;
    setAuthenticate:(value:boolean)=>void;
    setLoading:(value:boolean)=>void;
    logout:()=>void;
}

export const useAuthStore=create<AuthState>((set)=>({
    
    isAuthenticated:false,
    username:null,
    isLoading:true,

    setLoading:(value)=>set({isLoading:value}),
    setAuthenticate:(value)=>set({isAuthenticated:value}),
    setUsername:(name)=>set({username:name}),

    logout:()=>set({isAuthenticated:false , username:null})
}));
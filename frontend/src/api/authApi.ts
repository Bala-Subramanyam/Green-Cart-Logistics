import {api} from   './api';


export const authApi={
    login:(username:string,password:string)=>api.post('/auth/login',{username,password}),
    logout:()=>api.post('auth/logout')
}
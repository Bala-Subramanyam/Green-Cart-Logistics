import axios from 'axios';

const API_URL="http://localhost:3000/api"

export async function loginManger(username:string,password:string) {

    const response= await axios.post(`${API_URL}/auth/login`,{
        username,
        password
    },{withCredentials:true});
    return response.data;
}
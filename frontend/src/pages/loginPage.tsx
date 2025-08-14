import {useForm} from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { loginManger } from '../api/auth';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

//1.validation schema
const LoginSchema=z.object({
    username:z.string(),
    password:z.string()
});

//2.Infer form data type 
type LoginFormData=z.infer<typeof LoginSchema>;

export default function LoginPage(){
    const navigate=useNavigate();
    
    const setAuthenticate= useAuthStore((state)=>state.setAuthenticate);
    

    //setup for react hook form 

    const {
        register,
        handleSubmit,
        formState:{errors},
        setError,
    }=useForm<LoginFormData>({
        resolver:zodResolver(LoginSchema),
    });

    //handle form submit 
    const onSubmit=async(data:LoginFormData)=>{
        try{
            await loginManger(data.username,data.password);
            setAuthenticate(true);
            navigate('/dashboard');
        }catch(err:any){
            console.log(err);
            const message=err.response?.data?.message||"loginFailed";
            setError("root",{message});
        }
    };
    return(
        <div className='flex h-screen items-center justify-center bg-gray-100'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='bg-white p-6 rounded-lg shadow-lg w-96 space-y-4'
            >
                <h2 className='text-2xl font-bold text-center'>Manager Login</h2>

                {/* Global from error*/}

                {errors.root&&(<p className='text-red-500 text-sm'>{errors.root.message}</p>)}

                {/*username*/}
                <input type='text' placeholder='Username'className='border rounded w-full p-2' 
                    {...register('username')}
                />
                {errors.username&&(<p className='text-red-500 text-sm'>{errors.username.message}</p>)}

                {/*password*/} 
                <input type='password' placeholder='password' className='border rounded w-full p-2' 
                    {...register('password')}
                />
                {errors.password&&(<p className='text-red-500 text-sm'>{errors.password.message}</p>)}

                <button type='submit' className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" >
                    Login
                </button>
            </form>
        </div>
    );
}

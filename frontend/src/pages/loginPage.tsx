import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/authApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogIn, AlertTriangle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

//1.validation schema
const LoginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

//2.Infer form data type
type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();

  const setAuthenticate = useAuthStore((state) => state.setAuthenticate);
  const setUsername = useAuthStore((state) => state.setUsername);

  //setup for react hook form

  const form = useForm<LoginFormData>({
    defaultValues: {
      username: "employee1",
      password: "employee1Password",
    },
    resolver: zodResolver(LoginSchema),
  });

  //react query mutation for login
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) =>
      authApi.login(data.username, data.password),
    onSuccess: (_, data) => {
      setUsername(data.username);
      setAuthenticate(true);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      console.log(err);
      const message = err.response?.data?.message || "login Failed";
      form.setError("root", { message });
    },
  });
  //handle form submit
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <LogIn className="w-6 h-6" /> 
        Manager Login
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
          >
            {/* Global from error*/}

            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {/*username field*/}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>username</FormLabel>
                  <FormControl>
                    <Input placeholder="uername" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*password field*/}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*submit button*/}
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
              
            >
              {loginMutation.isPending ? "Logging in ..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

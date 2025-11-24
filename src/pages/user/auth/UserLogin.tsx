
import LoginForm from "@/components/shared/Login";
import loginBanner from "../../../assets/logI.png"
import { Button } from "@/components/ui/button";


export default function LoginPage() {

  const handleUserLogin = async(formData:{
    email:string;
    password:string;
    role:"user"|"vendor"|"admin";
  })=>{
    console.log("Recieved in user login page",formData)
  }

  return (
    
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
       <div className="relative">
              <img
                src={loginBanner}
                alt="loginBanner"
                className="w-full max-w-xl object-contain drop-shadow-lg mx-auto -mt-8"
              />
            </div>
      <LoginForm role="user" onSubmit={handleUserLogin}
         >
        <Button
          type="submit"
          size="lg"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold"
        >
          Login as User
        </Button>
      </LoginForm>
    </div>
  );

}

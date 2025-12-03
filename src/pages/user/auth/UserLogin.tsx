
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
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <img
                src={loginBanner}
                alt="loginBanner"
          className="w-full md:w-96 object-contain drop-shadow-lg"
              />
            </div>
 <div className="md:w-1/2 w-full">
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
    </div>
  );

}

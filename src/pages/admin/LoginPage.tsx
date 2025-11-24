import LoginForm from "@/components/shared/Login";
import { Button } from "@/components/ui/button";

const AdminLoginPage = () => {


  const handleAdminLogin = async(formData:{
    email:string;
    password:string;
    role:"user"|"vendor"|"admin";
  })=>{
    console.log("Recieved in vendor login page",formData)
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoginForm role="admin" onSubmit={handleAdminLogin}>
        <Button
          type="submit"
          size="lg"
          className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg font-semibold"
        >
          Login as Admin
        </Button>
      </LoginForm>
    </div>
  );
}

export default AdminLoginPage

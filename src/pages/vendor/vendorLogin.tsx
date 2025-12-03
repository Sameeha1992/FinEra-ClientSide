import LoginForm from "@/components/shared/Login";
import { Button } from "@/components/ui/button";

const VendorLoginPage = () => {


  const handleVendorLogin = async(formData:{
    email:string;
    password:string;
    role:"user"|"vendor"|"admin";
  })=>{
    console.log("Recieved in vendor login page",formData)
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      
      <LoginForm role="vendor" onSubmit={handleVendorLogin}>
        <Button
          type="submit"
          size="lg"
          className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg font-semibold"
        >
          Login as Vendor
        </Button>
      </LoginForm>
    </div>
  );
}

export default VendorLoginPage

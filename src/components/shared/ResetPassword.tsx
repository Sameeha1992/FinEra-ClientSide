
import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import { authService } from "@/api/AuthServiceAndProfile";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // email passed from Verify OTP page
  const email = searchParams.get("email");
  const role= searchParams.get("role") as "user"|"vendor"

  const emailValue = email

  if(!emailValue){
    toast.error("Email is missing. Cannot reset password.");
    navigate("/")
    return
  }

  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting,setisSubmitting] = useState(false)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setisSubmitting(true)

    const result = resetPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setisSubmitting(false)
      return;
    }

    try {
      if(role==="user"){
       await authService.resetPassword(emailValue,formData.password);
      }else if(role==="vendor"){
        await authService.resetVendorPassword(email,formData.password);
      }

      toast.success("Password reset successfully!");

      navigate(`/${role}/login`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally{
      setisSubmitting(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2 text-center">Reset Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div>
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              name="password"
              className="w-full border rounded p-3 mt-1"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border rounded p-3 mt-1"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { authService } from "@/api/AuthServiceAndProfile";
import { setAuth } from "@/redux/slice/auth.slice";
import { useLocation, useNavigate } from "react-router-dom";
import type { LoginFormProps } from "@/interfaces/shared/auth/auth.interface";
import {
  loginSchema,
  type LoginValue,
} from "@/validations/shared/validation.helpers";
import { Link } from "react-router-dom";
import GoogleSignupButton from "./GoogleSignupButton";



export default function LoginForm({
  role = "user",
  onSubmit,
  children,
}: LoginFormProps & { children?: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<LoginValue>({
    email: "",
    password: "",
    role: role,
  });
  const [errors, setErrors] = useState({ email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname.includes("/login");


  const handleInputChange = (field: keyof LoginValue, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateField = (field: keyof LoginValue, value: string) => {
    const result = loginSchema.shape[field].safeParse(value);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0].message,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const newError = { email: "", password: "", role: "" };
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginValue;
        newError[field] = issue.message;
        toast.error(issue.message);
      });
      setErrors(newError);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }

    let toastId: string | undefined;
    try {
      setLoading(true);
      toastId = toast.loading("Logging in...");

      // const res = await authService.login({...formData});

      let res;
      if (formData.role === "admin") {
        res = await authService.adminLogin({
          email: formData.email,
          password: formData.password,
        });
      } else if (formData.role === "vendor") {
        console.log("venmdor login working");
        res = await authService.vendorLogin({
          email: formData.email,
          password: formData.password,
        });
      } else {
        res = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      }

      console.log("response", res);

      if (res.data.success) {
        if (formData.role === "vendor") {
          dispatch(setAuth(res.data.vendor));
          navigate("/vendor/dashboard", { replace: true });
        } else {
          dispatch(setAuth(res.data.user || res.data.admin));
          if (formData.role === "admin") navigate("/admin/dashboard");
          else navigate("/user/home", { replace: true });
        }
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong.Please try again";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto">
      {/* Header inside the form */}
      <div className="space-y-1 text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
        <p className="text-gray-500 text-sm">
          Welcome back! Please login to your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={() => validateField("email", formData.email)}
            className={`px-4 py-3 rounded-lg border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-teal-500`}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            onBlur={() => validateField("password", formData.password)}
            className={`px-4 py-3 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-teal-500`}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        {/* <div className="flex justify-end">
          <a
            href="#"
            className="text-sm text-teal-600 hover:underline hover:text-teal-700"
          >
            Forgot password?
          </a>
        </div> */}
       {role !== "admin" &&(
        <Link
        
          to={`/${role}/forget-password`}
          className="text-sm text-teal-600 hover:underline hover:text-teal-700"
        >
          Forget Password
        </Link>
       )}
        

        {serverError && (
          <p className="text-red-600 text-sm font-medium bg-red-100 p-2 rounded-md border border-red-300">
            {serverError}
          </p>
        )}

        {/* <Button
          type="submit"
          size="lg"
          className={`w-full text-white py-3 rounded-lg font-semibold ${
            formData.role === "admin"
              ? "bg-green-800 hover:bg-green-900"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {title}
        </Button> */}
        {children}

        <div className="mt-4 flex justify-center">
        {role !== "admin" && isLoginPage && (<GoogleSignupButton role={role} />)}
        </div>
      </form>

      {/* Signup link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don’t have an account?{" "}
        <a
          href="/user/signup"
          className="text-teal-600 font-semibold hover:underline"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}

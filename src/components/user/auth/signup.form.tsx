import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authService } from "@/api/AuthServiceAndProfile";
import {z} from "zod"



const formSchema = z
  .object({
    fullName:z.string().max(20,"Should not exceed above 20 letters")
    .min(3,"Name too short")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(25, "Email too long"),

      phone:z.string().max(10,"Should not exceed above 10 numbers").regex(/[1-9]/,"please enter only numbers"),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters")
      .regex(
        /[A-Z]/,
        "Password must have at least one uppercase,one lowercase, one number, and one special character"
      )
      .regex(
        /[a-z]/,
        "Password must have at least one uppercase,one lowercase, one number, and one special character"
      )
      .regex(
        /[0-9]/,
        "Password must have at least one uppercase,one lowercase, one number, and one special character"
      )
      .regex(
        /[\W_]/,
        "Password must have at least one uppercase,one lowercase, one number, and one special character"
      ),
    confirmPassword: z.string().min(8, "Password must be atleast 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>


export function SignupForm() {

  const [formData,setFormData] = useState<FormData>({
    fullName:'',
    email:'',
    phone:'',
    password:'',
    confirmPassword:'',
    
  })


  const [loading,setLoading] = useState<boolean>(false);
  const [message,setMessage] = useState<string>("");
  const navigate = useNavigate()
 
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value,
    })
  }

  const handleSubmit = async(e: React.FormEvent)=>{
    e.preventDefault()
    setLoading(true);
    setMessage('');

    if(formData.password !== formData.confirmPassword){
      setMessage("Password do not match");
      setLoading(false);
      return 
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(formData.email)){
      setMessage('Please enter a valid email address');
      setLoading(false);
      return; 
    }

    const userData ={
      name:formData.fullName,
      email:formData.email,
      phone:formData.phone,
      password:formData.password,
      role:"user" as const
      
    };
    console.log('Submitting form, navigating to OTP page with:',userData);

    try {

      const response = await authService.generateOtp(userData.email);
      console.log("OTP generated:",response);

      navigate("/user/verify-otp", {state:{userData:{
        name:formData.fullName,
        email:formData.email,
        phone:formData.phone,
        password:formData.password,
        role:"user" as const
      }}})
      
       
    } catch (error:any) {
      console.error('Failed to generate OTP',error);
      setMessage(error || 'Failed to send OTP. PLease try again')
    } finally{
      setLoading(false)
    }

    
  }
  return (
    <form
      className="space-y-6"  onSubmit={handleSubmit}
      aria-labelledby="signup-heading"
    >
      <h2 id="signup-heading" className="text-3xl md:text-4xl font-semibold tracking-tight">
        Sign up
      </h2>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullName" className="text-base md:text-lg">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="rounded-md border border-input bg-background px-3 py-3 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring"
            
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-base md:text-lg">
            Enter your email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Username or email address"
            className="rounded-md border border-input bg-background px-3 py-3 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring"
            
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-base md:text-lg">
            Enter your phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="rounded-md border border-input bg-background px-3 py-3 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring"
          />
        </div>


        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-base md:text-lg">
            Enter your Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="rounded-md border border-input bg-background px-3 py-3 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring"
            
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-base md:text-lg">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className="rounded-md border border-input bg-background px-3 py-3 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring"
            
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/user/login" className="underline underline-offset-2">
            Log in
          </Link>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-primary-foreground text-sm font-medium"
        >
          {loading ? 'Loading...' :'Sign up'}
        </button>
      </div>

      <div className="pt-4">
        <a
          href="#"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition"
          aria-label="Continue with Google"
        >
          <span className="inline-block h-5 w-5 rounded-full border border-input text-xs font-bold grid place-items-center">
            G
          </span>
          Continue with Google
        </a>
      </div>
    </form>
  )
}

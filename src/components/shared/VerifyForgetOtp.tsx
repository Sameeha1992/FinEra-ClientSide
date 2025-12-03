import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OtpInput from './OtpInput';
import toast from 'react-hot-toast';
import { authService } from '@/api/AuthServiceAndProfile';
import { Button } from '../ui/button';

const VerifyForgetOtp = ({role}:{role:"user"|"vendor"}) => {
    const location = useLocation();
    const navigate = useNavigate();


    const email = (location.state as {email:string})?.email || "";

 const [error, setError] = useState("");
 const [timer,setTimer] = useState(60);



 useEffect(()=>{
  if(timer <=0) return;

  const interval = setInterval(() => {
    setTimer((prev)=>prev-1)
  }, 1000);
  return ()=>clearInterval(interval)
 },[timer])



  const handleComplete = async (otp: string) => {
    setError("");

    try {
      if (role === "user") {
        await authService.verifyForgetPassword(email, otp);
      } else {
        await authService.verifyVendorForgetOtp(email, otp);
      }

      toast.success("OTP verified successfully!");
      navigate(`/${role}/reset-password?email=${email}&role=${role}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Verify OTP</h1>
          <p className="text-muted-foreground text-center mb-8">
            Enter the 6-digit OTP sent to your email
          </p>

          <OtpInput length={6} onComplete={handleComplete} />

          {error && (
            <p className="text-red-600 text-sm text-center mt-4">{error}</p>
          )}

          {/* ⭐ TIMER DISPLAY ONLY */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            OTP expires in <span className="font-semibold">{timer}s</span>
          </p>

           <Button
            className="mt-6 w-full"
            // onClick={handleButtonClick}
          >
            Verify OTP
          </Button>
        </div>
      </div>
    </div>
  );

}

export default VerifyForgetOtp

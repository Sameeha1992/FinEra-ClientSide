import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from "sonner";
import OtpInput from "@/components/shared/OtpInput";
import otpIllustration from "@/assets/logI.png";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/api/AuthServiceAndProfile";
import type {
  LocationState,
  UserPayload,
} from "@/interfaces/shared/auth/auth.interface";
import z from "zod";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be exactly 6 digits")
    .max(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

const OtpVerification = () => {
  const [otp, setOtp] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const userData = state?.userData;

  useEffect(() => {
    if (!userData?.email || !userData?.role) {
      sonnerToast.error("Session expired.Please register again.");
      navigate(
        userData?.role === "vendor"
          ? "/vendor/vendor-register"
          : "/user/register"
      );
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOTPComplete = (value: string) => {
    console.log("OTP entered:", value);
    setOtp(value);

    if (message) setMessage("");
  };

  const handleSubmit = async () => {
    console.log("Submitting OTP:", otp);
    const result = otpSchema.safeParse({ otp });
    if (!result.success) {
      const errorMessage = result.error.issues[0].message; // CHANGE: Extracts first error message for user-friendly display
      setMessage(errorMessage);
      sonnerToast.error(errorMessage); // CHANGE: Added toast for validation errors to match success/error patterns
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (userData.role === "vendor") {
        await authService.verifyVendorOtp({
          email: userData.email,
          otp: result.data.otp,
          role: "vendor",
        });
      } else {
        await authService.verifyOtp({
          email: userData.email,
          otp: result.data.otp,
          role: "user",
        });
      }
      sonnerToast.success("OTP verified successfully");

      if (userData.role === "vendor") {
        await authService.vendorRegister({
          name: userData.name,
          email: userData.email,
          registerNumber: userData.registerNumber,
          password: userData.password,
        });
        sonnerToast.success("Vendor account created");
        navigate("/vendor/login",{replace:true});
      } else {
        await authService.register({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
        });
        sonnerToast.success("Account created successfully");
        navigate("/user/login",{replace:true});
      }
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid OTP";
      setMessage(errorMessage);
      sonnerToast.error((error as string) || "Failed to verify OTP ");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;

    try {
      setLoading(true);
      if (userData.role === "vendor") {
        await authService.generateVendorOtp(userData.email);
      } else {
        await authService.generateOtp(userData.email);
      }
      setTimeLeft(120);
      setMessage("OTP send to your email");
      sonnerToast.success("OTP send to your email");
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend OTP";
      setMessage(errorMessage);
      sonnerToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-4xl sm:max-w-5xl">
            <div className="grid items-center gap-6 sm:gap-8 md:gap-12 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <h3 className="mb-6 text-2xl md:text-4xl lg:text-5xl font-bold text-foreground text-center md:text-left">
                  Please enter your OTP
                </h3>
                <img
                  src={otpIllustration}
                  alt="Financial services illustration"
                  className="w-full max-w-xs sm:max-w-sm mx-auto md:max-w-full md:mx-0"
                />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full max-w-md rounded-2xl bg-card p-6 sm:p-8 shadow-lg">
                  {message && (
                    <div
                      className={`mb-4 p-3 rounded-md text-center text-sm ${
                        message.includes("Failed") || message.includes("error")
                          ? "bg-destructive/10 text-destructive"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <OtpInput length={6} onComplete={handleOTPComplete} />

                  <div className="mt-6 text-center">
                    <p className="text-xl sm:text-2xl font-semibold text-[hsl(var(--timer-text))]">
                      {formatTime(timeLeft)} Sec
                    </p>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={handleSubmit}
                      className="h-12 w-full bg-primary text-base sm:text-lg font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Submit
                    </Button>
                  </div>

                  <div className="mt-6 text-center text-xs sm:text-sm">
                    <span className="text-muted-foreground">
                      Don't receive code?{" "}
                    </span>
                    <button
                      onClick={handleResend}
                      disabled={timeLeft > 0}
                      className="font-medium text-foreground underline hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
                    >
                      Re-send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OtpVerification;

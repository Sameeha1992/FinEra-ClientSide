import React, { useState, useRef } from "react";
import { Toaster, toast } from "sonner";

export default function OTPInput({ length = 6 }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      toast.success("OTP Verified!");
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => {inputRefs.current[index] = ref}}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-16 w-16 rounded-lg border-2 border-border bg-input text-center text-2xl font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        ))}
      </div>

      {/* Sonner Toaster */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

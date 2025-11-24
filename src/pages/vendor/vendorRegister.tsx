import React from 'react';
import RegistrationForm from '@/components/vendor/VendorRegister';
import vendorImage from "assets/vendorRegsiterImage.png"

const VendorRegistrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50/50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">

        {/* LEFT SIDE: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 mb-10">Create a great platform for managing your cases & clients</p>
            <RegistrationForm />
          </div>
        </div>

        {/* RIGHT SIDE: Image */}
        <div className="hidden md:flex w-1/2 bg-[#EBF5FF] relative flex-col items-center justify-center p-12 overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 w-full max-w-lg">
            <img
              src={vendorImage}
              alt="Vendor Illustration"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorRegistrationPage;

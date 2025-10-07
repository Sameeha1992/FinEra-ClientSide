"use client";

import Header from "@/components/user/shared/Header";
import Footer from "@/components/user/shared/Footer";
import LoginForm from "@/components/shared/Login";
import loginBanner from "@/assets/loginBanner.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid lg:grid-cols-2 gap-6 items-center min-h-[calc(100vh-120px)]">
          {/* Left Side - Welcome Section */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
              Welcome to <br /> FinEra
            </h1>
            <div className="relative">
              <img
                src={loginBanner}
                alt="loginBanner"
                className="w-full max-w-xxl mx-auto -mt-4"
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
            required
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
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <a
            href="#"
            className="text-sm text-teal-600 hover:underline hover:text-teal-700"
          >
            Forgot password?
          </a>
        </div>

        {/* Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold"
        >
          Sign In
        </Button>
      </form>

      {/* Signup link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don’t have an account?{" "}
        <a href="#" className="text-teal-600 font-semibold hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}

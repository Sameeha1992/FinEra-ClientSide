'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registrationSchema, type RegistrationFormData } from '@/components/pages/validation/vendorAuthSchema';
import {authService} from '@/api/AuthServiceAndProfile';

const VendorRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    registerNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Zod Validation
    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    const registerPayload = {
        name: formData.name,
        email: formData.email,
        registerNumber: formData.registerNumber,
        password: formData.password,
      };


    try {
      
      const response = await authService.generateVendorOtp(registerPayload.email);
      console.log("Otp genertaed for vendor",response)
      navigate("/vendor/verify-otp",{
        state:{
          userData:{
          name:formData.name,
          email:formData.email,
          registerNumber:formData.registerNumber,
          password:formData.password,
          role:"vendor" as const
          }
          
        }
      });

      // await authService.vendorRegister(registerPayload);

      setSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Failed to generate OTP');
       
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  // if (success) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
  //       <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
  //         <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
  //         <h1 className="text-4xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
  //         <p className="text-lg text-gray-600 mb-8">
  //           Welcome, <span className="font-bold">{formData.name}</span>! Your vendor account is ready.
  //         </p>
  //         <button
  //           onClick={() => navigate('/vendor/login')}
  //           className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-5 rounded-xl text-lg transition"
  //         >
  //           Go to Login
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">Vendor Registration</h1>
        <p className="text-center text-gray-600 mb-10">Fill in your details to get started</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-5 py-4 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-4 focus:ring-blue-100 transition`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@business.com"
              className={`w-full px-5 py-4 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-4 focus:ring-blue-100 transition`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Register Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Register Number</label>
            <input
              type="text"
              name="registerNumber"
              value={formData.registerNumber}
              onChange={handleChange}
              placeholder="REG-2025-001"
              className={`w-full px-5 py-4 rounded-xl border ${errors.registerNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-4 focus:ring-blue-100 transition`}
            />
            {errors.registerNumber && <p className="text-red-500 text-sm mt-1">{errors.registerNumber}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-5 py-4 rounded-xl border pr-14 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-4 focus:ring-blue-100 transition`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-5 py-4 rounded-xl border pr-14 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-4 focus:ring-blue-100 transition`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white font-bold py-5 rounded-xl text-lg shadow-lg transition transform hover:scale-[1.02] disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Register as Vendor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorRegistrationPage;
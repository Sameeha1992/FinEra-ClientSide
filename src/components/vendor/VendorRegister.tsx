import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { registrationSchema, type RegistrationFormData } from '@/components/pages/validation/vendorAuthSchema';
import { authService } from '@/api/AuthServiceAndProfile';
import toast from 'react-hot-toast';
import { handleApiError } from '@/utils/apiError';

const VendorRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

    try {
      const response = await authService.generateVendorOtp(formData.email);
      console.log('OTP generated for vendor', response);
      navigate('/vendor/verify-otp', {
        state: {
          userData: {
            name: formData.name,
            email: formData.email,
            registerNumber: formData.registerNumber,
            password: formData.password,
            confirmPassword:formData.confirmPassword,
            role: 'vendor' as const,
          },
        },
      });
    } catch (err: unknown) {
      toast.error(handleApiError(err, 'Failed to generate OTP'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} aria-labelledby="vendor-register-heading">

      {/* Heading */}
      <div>
        <h2 id="vendor-register-heading" className="text-3xl md:text-4xl font-semibold tracking-tight">
          Sign up
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create your vendor account to get started
        </p>
      </div>

      <div className="space-y-4">

        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-base md:text-lg">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`rounded-md border px-3 py-3 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring bg-background ${errors.name ? 'border-red-500 bg-red-50' : 'border-input'
              }`}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
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
            className={`rounded-md border px-3 py-3 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring bg-background ${errors.email ? 'border-red-500 bg-red-50' : 'border-input'
              }`}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        {/* Register Number */}
        <div className="flex flex-col gap-1">
          <label htmlFor="registerNumber" className="text-base md:text-lg">
            Register Number
          </label>
          <input
            id="registerNumber"
            name="registerNumber"
            type="text"
            value={formData.registerNumber}
            onChange={handleChange}
            placeholder="REG-2025-001"
            className={`rounded-md border px-3 py-3 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring bg-background ${errors.registerNumber ? 'border-red-500 bg-red-50' : 'border-input'
              }`}
          />
          {errors.registerNumber && <p className="text-red-600 text-sm">{errors.registerNumber}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-base md:text-lg">
            Enter your Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full rounded-md border px-3 py-3 pr-11 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring bg-background ${errors.password ? 'border-red-500 bg-red-50' : 'border-input'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-base md:text-lg">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className={`w-full rounded-md border px-3 py-3 pr-11 text-base md:text-lg outline-none focus:ring-2 focus:ring-ring bg-background ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-input'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
        </div>

      </div>

      {/* Bottom row: login link + submit */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/vendor/login" className="underline underline-offset-2">
            Log in
          </Link>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-primary-foreground text-sm font-medium disabled:opacity-60 transition"
        >
          {loading ? 'Creating Account...' : 'Sign up'}
        </button>
      </div>

    </form>
  );
};

export default VendorRegistrationForm;
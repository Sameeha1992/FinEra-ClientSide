
import { authService } from "@/api/AuthServiceAndProfile"
import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function ForgotPassword({role}:{role:"user"|"vendor"}) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Email validation
    if (!email) {
      setError("Email is required")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email")
      return
    }

    try {
      let res

      if(role === "user"){
        res = await authService.forgetPassword(email)
      }else if(role === "vendor"){
        res = await authService.forgetPasswordVendor(email)
      }

      navigate(`/${role}/verify-forget-otp`,{state:{email,role}})
      
    } catch (error) {
      console.log(error)
      return
    }

    // Show success message
    setIsSubmitted(true)
    setTimeout(() => {
      setEmail("")
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
          {/* Header */}
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Forgot Password</h1>
          <p className="text-muted-foreground text-center mb-8">Enter your email to reset your password</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              />
              {error && <p className="text-sm text-destructive mt-1">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 hover:shadow-lg"
            >
              {isSubmitted ? "Email Sent! ✓" : "Send Reset Link"}
            </button>

            {/* Success Message */}
            {isSubmitted && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm text-center">
                Check your email for password reset instructions
              </div>
            )}
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline font-medium transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

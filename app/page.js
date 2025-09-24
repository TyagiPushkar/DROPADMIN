"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const API_URL = "https://namami-infotech.com/DROPRIDER/src/auth/login.php"

 
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, send_otp: true }),
      })
      const data = await res.json()
      if (data.success) {
        setStep(2)
      } else {
        setError(data.message || "Failed to send OTP")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, otp, verify_otp: true }),
      })
      const data = await res.json()
      console.log("Verify response:", data)
      if (data.success) {
        Cookies.set("user", JSON.stringify(data.data), { expires: 1 })
        router.push("/analytics")
      } else {
        setError(data.message || "Invalid OTP")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  
  const handleLoginPassword = async (e) => {
    e.preventDefault()
    if (!password) {
      setError("Please enter your password")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      })
      const data = await res.json()
      console.log("Password login response:", data)
      if (data.success) {
        Cookies.set("user", JSON.stringify(data.data), { expires: 1 })
        router.push("/analytics")
      } else {
        setError(data.message || "Invalid credentials")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 items-center justify-center p-10 text-white relative">
        <div className="max-w-md text-center space-y-6">
          
          {/* <img
            src="/logo.png"
            alt="Logo"
            className="mx-auto w-24 h-24 object-contain"
          /> */}
          <div className="text-4xl font-extrabold tracking-wide mt-4">
            Welcome Back
          </div>
          <p className="text-lg opacity-90">
            Sign in securely with OTP or your password.
          </p>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm opacity-70">
            Secure • Fast • Reliable
          </div>
        </div>
      </div>

    
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 1
                ? "Choose Login Method"
                : step === 2
                ? "Verify Your OTP"
                : "Login with Password"}
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              {step === 1
                ? "Select OTP or Password login."
                : step === 2
                ? "Check your email and enter the OTP below."
                : "Enter your email and password to sign in."}
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              {error}
            </div>
          )}

        
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 shadow-sm"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold shadow-lg"
              >
                Login with OTP
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold shadow-lg"
              >
                Login with Password
              </button>
            </div>
          )}

          
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="6-digit OTP"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold shadow-lg"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <p
                className="text-sm text-blue-600 hover:underline cursor-pointer text-center"
                onClick={() => setStep(1)}
              >
                Back
              </p>
            </form>
          )}

         
          {step === 3 && (
            <form onSubmit={handleLoginPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold shadow-lg"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p
                className="text-sm text-blue-600 hover:underline cursor-pointer text-center"
                onClick={() => setStep(1)}
              >
                Back
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

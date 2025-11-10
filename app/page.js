"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
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

  return (
    <div className="flex h-screen">
      
     
      <div className="hidden md:flex md:w-2/3 relative text-white">
  
  <img
    src="/images/delivery.jpg"
    alt="Delivery background"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/60" />

  <div className="relative z-10 flex flex-col justify-between w-full p-10">
   
    <div className="absolute top-6 left-6">
      <img
        src="/images/droplogo.jpg"
        alt="App Logo"
        className="w-16 h-16 object-contain bg-white p-2 rounded-full shadow-xl ring-2 ring-indigo-500"
      />
    </div>

   
    <div className="flex flex-col items-center text-center space-y-6 mb-12 mt-auto">
      <p className="text-lg opacity-90 max-w-sm">
        Welcome back! Sign in securely with your email OTP.
      </p>
    </div>

   
    <div className="text-sm opacity-70 mb-4 text-center">
      Secure Access • Fast • Reliable
    </div>
  </div>
</div>



      
<div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
  <div className="w-full max-w-md space-y-6">
   
    <div className="flex justify-center">
    <img
        src="/images/droplogo.jpg"
        alt="App Logo"
        className="mx-auto w-28 h-28 object-contain bg-white p-3 rounded-full shadow-2xl ring-4 ring-indigo-500"
      />
    </div>

   
    <div className="w-full bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {step === 1 ? "Sign in to Continue" : "Verify Your OTP"}
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          {step === 1
            ? "Enter your email to receive a one-time login code."
            : "Check your email and enter the OTP below."}
        </p>
      </div>

      
      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg text-center">
          {error}
        </div>
      )}

     
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          
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
            type="submit"
            disabled={loading}
            style={{backgroundColor:"#06a8edff"}}
            className="w-full flex items-center justify-center gap-2 text-white py-3 cursor-pointer rounded-lg hover:opacity-90 transition font-semibold shadow-lg disabled:opacity-70"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          
          {/* <button
            type="button"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 cursor-pointer transition font-semibold shadow-lg"
          >
            Login with Password
          </button> */}

         
          <p className="text-center text-sm text-gray-600 mt-3">
            Click
            <a
              href="/add-vendor"
              className="text-blue-600 hover:underline font-medium"
            >
              &nbsp;here
            </a>{" "}
            to register your restaurant
          </p>
        </form>
      ) : (
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
            style={{backgroundColor:"#06a8edff"}}
            className="w-full cursor-pointer text-white py-3 rounded-lg hover:opacity-90 transition font-semibold shadow-lg"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p
            className="text-sm text-blue-600 hover:underline cursor-pointer text-center"
            onClick={() => setStep(1)}
          >
            Resend OTP
          </p>
        </form>
      )}
    </div>
  </div>
</div>

    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const API_URL = BASE_URL + "auth/login.php"

  // ---------------------------
  // PASSWORD LOGIN
  // ---------------------------
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier,
          password: password,
        }),
      })

      const data = await res.json()
      console.log("Login response:", data)

      if (data.success) {
        Cookies.set("user", JSON.stringify(data.data), {
          expires: 1, // 1 day
        })

        const userType = data.data.UserType
        const userId = data.data.UserId

        if (userType === "Restaurant") {
          router.push(`/vendor-dashboard/${userId}`)
        } else if (userType === "Rider") {
          router.push(`/rider-dashboard/${userId}`)
        } else {
          router.push("/settings")
        }
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

  // =====================================================
  // OTP LOGIN (COMMENTED OUT FOR NOW)
  // =====================================================

  /*
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    ...
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    ...
  }
  */

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="flex h-screen">
      {/* LEFT IMAGE */}
      <div className="hidden md:flex md:w-2/3 relative text-white">
        <img
          src="/images/delivery.jpg"
          alt="Delivery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <img
              src="/images/droplogo.jpg"
              alt="App Logo"
              className="w-28 h-28 object-contain bg-white p-3 rounded-full shadow-2xl ring-4 ring-indigo-500"
            />
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Sign in to Continue
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Login using your email or phone and password
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Phone
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="email or phone"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#06a8edff" }}
                className="w-full text-white py-3 rounded-lg hover:opacity-90 transition font-semibold shadow-lg disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

             
              {/*
              <p
                className="text-sm text-blue-600 hover:underline cursor-pointer text-center"
                onClick={() => setStep(1)}
              >
                Login with OTP
              </p>
              */}

              <p className="text-center text-sm text-gray-600 mt-3">
                New Rider?
                <a
                  href="/add-rider"
                  className="text-blue-600 hover:underline font-medium"
                >
                  &nbsp;Onboard here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export const BASE_URL = "https://namami-infotech.com/DROP/src/"

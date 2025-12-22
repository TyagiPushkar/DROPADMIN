"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { LogOut, User } from "lucide-react"
import UpdatePassword from "@/components/settings/updatePassword"
import SetPassword from "@/components/settings/setPassword"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const userCookie = Cookies.get("user")
    
    if (!userCookie) {
      router.push("/") // redirect to login if not logged in
      return
    }

    try {
      const parsedUser = JSON.parse(userCookie)
      console.log("Parsed user object:", parsedUser)

      setUser(parsedUser)
      // ✅ use FullName and Email from backend
      setName(parsedUser.FullName || "")
      setEmail(parsedUser.Email || "")
    } catch (err) {
      console.error("Error parsing user cookie:", err)
    }
  }, [router])

  const handleLogout = () => {
    Cookies.remove("user")
    router.push("/")
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b">
          <div className="h-14 w-14 rounded-full bg-cyan-100 text-black flex items-center justify-center text-xl font-semibold">
            {getInitials(name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {/* Password Section */}
          {user && (
  <div className="space-y-4 border-t pt-6">
    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      🔐 Password Settings
    </h2>

    {user.PasswordHash ? (
      <UpdatePassword userId={user.UserId} />
    ) : (
      <SetPassword userId={user.UserId} />
    )}
  </div>
)}


          <button className="bg-cyan-100 text-black px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>

        {/* Logout */}
        <div className="border-t pt-6 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 cursor-pointer font-medium hover:text-red-700 transition"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

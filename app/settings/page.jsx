"use client"

import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { LogOut, User, Lock, Bell } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove("user")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
       
        <div className="flex items-center gap-4 pb-6 border-b">
          <div className="h-14 w-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
            AD
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 text-sm">Manage your account and preferences</p>
          </div>
        </div>

        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>

       
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-500" /> Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="New Password"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition">
            Update Password
          </button>
        </div>

        
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-500" /> Notifications
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-purple-600" />
              <span className="text-gray-700">Email Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-purple-600" />
              <span className="text-gray-700">Push Notifications</span>
            </label>
          </div>
        </div>

       
        <div className="border-t pt-6 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { LogOut, User, Pencil, X } from "lucide-react"
import UpdatePassword from "@/components/settings/updatePassword"
import SetPassword from "@/components/settings/setPassword"
import { BASE_URL } from "../page"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  })
  

  useEffect(() => {
    const userCookie = Cookies.get("user")
    
    if (!userCookie) {
      router.push("/")
      return
    }

    try {
      const parsedUser = JSON.parse(userCookie)
      setUser(parsedUser)
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

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel → reset values from cookie
      setName(user.FullName || "")
      setEmail(user.Email || "")
    }
    setIsEditing(!isEditing)
  }
  const validateForm = () => {
    let newErrors = { name: "", email: "" }
  
    // Name required
    if (!name.trim()) {
      newErrors.name = "Full name is required"
    }
  
    // Email required + valid format
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        newErrors.email = "Please enter a valid email address"
      }
    }
  
    setErrors(newErrors)
  
    // Return true only if no errors
    return !newErrors.name && !newErrors.email
  }
  

  const handleSave = async () => {
    if (!user) return
  
    
    const isValid = validateForm()
    if (!isValid) return
  
    setLoading(true)
    try {
      const res = await fetch(BASE_URL + "/user/update_profile.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.UserId,
          fullName: name.trim(),
          email: email.trim(),
        }),
      })
  
      const data = await res.json()
  
      if (data.success) {
        const updatedUser = {
          ...user,
          FullName: name.trim(),
          Email: email.trim(),
        }
  
        Cookies.set("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
        setIsEditing(false)
        setErrors({ name: "", email: "" }) // clear errors
        alert("Profile updated successfully")
      } else {
        alert(data.message || "Update failed")
      }
    } catch (error) {
      console.error("Update error:", error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
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
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" /> Personal Information
            </h2>

            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 text-sm px-3 py-1 rounded-lg border hover:bg-gray-100"
            >
              {isEditing ? <X size={16} /> : <Pencil size={16} />}
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Name */}
  <div>
    <input
      type="text"
      value={name}
      disabled={!isEditing}
      onChange={(e) => {
        setName(e.target.value)
        if (errors.name) setErrors({ ...errors, name: "" })
      }}
      placeholder="Full Name"
      className={`border rounded-lg px-4 py-3 w-full outline-none ${
        errors.name
          ? "border-red-500"
          : isEditing
          ? "border-blue-500"
          : "border-gray-200 bg-gray-100 cursor-not-allowed"
      }`}
    />
    {errors.name && (
      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
    )}
  </div>

  {/* Email */}
  <div>
    <input
      type="email"
      value={email}
      disabled={!isEditing}
      onChange={(e) => {
        setEmail(e.target.value)
        if (errors.email) setErrors({ ...errors, email: "" })
      }}
      placeholder="Email Address"
      className={`border rounded-lg px-4 py-3 w-full outline-none ${
        errors.email
          ? "border-red-500"
          : isEditing
          ? "border-blue-500"
          : "border-gray-200 bg-gray-100 cursor-not-allowed"
      }`}
    />
    {errors.email && (
      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
    )}
  </div>
</div>


          {/* Save Button (Only visible in edit mode) */}
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-cyan-100 text-black px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}

          {/* Password Section */}
          {user && (
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-800">
                🔐 Password Settings
              </h2>

              {user.PasswordHash ? (
                <UpdatePassword userId={user.UserId} />
              ) : (
                <SetPassword userId={user.UserId} />
              )}
            </div>
          )}
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

'use client'
import { useState } from "react"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export default function UpdatePassword({ userId }) {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [msg, setMsg] = useState("")
    const [msgType, setMsgType] = useState("") // success, error, info
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChangePassword = async () => {
      if (newPassword.length < 6) {
        setMsg("Password must be 6+ characters")
        setMsgType("error")
        return
      }
      if (newPassword !== confirm) {
        setMsg("Passwords do not match")
        setMsgType("error")
        return
      }

      setLoading(true)
      setMsg("")
      setMsgType("")

      const res = await fetch("http://localhost:8000/src/user/change_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      })

      const data = await res.json()
      setMsg(data.message)
      setMsgType(data.success ? "success" : "error")
      setLoading(false)

      // Clear form on success
      if (data.success) {
        setOldPassword("")
        setNewPassword("")
        setConfirm("")
      }
    }

    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
          <p className="text-gray-500 mt-1">Update your account password</p>
        </div>

        {/* Password Inputs */}
        <div className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={loading}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className={`flex items-center ${newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className="mr-2">
                  {newPassword.length >= 6 ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-gray-300" />
                  )}
                </div>
                At least 6 characters
              </li>
              <li className={`flex items-center ${newPassword === confirm && newPassword !== '' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className="mr-2">
                  {newPassword === confirm && newPassword !== '' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-gray-300" />
                  )}
                </div>
                Passwords match
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleChangePassword}
            disabled={loading || !oldPassword || !newPassword || !confirm}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              loading || !oldPassword || !newPassword || !confirm
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Changing Password...
              </div>
            ) : (
              "Change Password"
            )}
          </button>

          {/* Message */}
          {msg && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              msgType === "success" 
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {msgType === "success" ? (
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm">{msg}</p>
            </div>
          )}

          {/* Security Note */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              🔒 Your password is securely encrypted. We recommend using a unique password that you don't use elsewhere.
            </p>
          </div>
        </div>
      </div>
    )
  }
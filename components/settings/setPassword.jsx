'use client'
import { useState, useEffect } from "react"
import { BASE_URL } from "@/app/page"
import Cookies from "js-cookie"

export default function SetPassword({ userId }) {
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [msg, setMsg] = useState({ text: "", type: "" }) // success, error, info
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [requirements, setRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    })

    // Check password requirements
    useEffect(() => {
        if (password.length === 0) {
            setPasswordStrength(0)
            setRequirements({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false
            })
            return
        }

        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        }

        setRequirements(checks)
        
        // Calculate strength (0-100)
        const passed = Object.values(checks).filter(Boolean).length
        setPasswordStrength((passed / 5) * 100)
    }, [password])

    // Get strength color
    const getStrengthColor = () => {
        if (passwordStrength < 40) return "bg-red-500"
        if (passwordStrength < 70) return "bg-yellow-500"
        return "bg-green-500"
    }

    // Get strength text
    const getStrengthText = () => {
        if (passwordStrength < 40) return "Weak"
        if (passwordStrength < 70) return "Medium"
        return "Strong"
    }

    const validatePassword = () => {
        if (password.length < 8) {
            setMsg({ 
                text: "Password must be at least 8 characters long", 
                type: "error" 
            })
            return false
        }
        
        if (password !== confirm) {
            setMsg({ 
                text: "Passwords do not match", 
                type: "error" 
            })
            return false
        }

        if (passwordStrength < 70) {
            setMsg({ 
                text: "Please use a stronger password", 
                type: "error" 
            })
            return false
        }

        return true
    }

    const handleSetPassword = async (e) => {
        e.preventDefault()
        
        if (!validatePassword()) return
        
        setLoading(true)
        setMsg({ text: "", type: "" })

        try {
            const res = await fetch(BASE_URL+"user/set_password.php", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ 
                    userId, 
                    password 
                }),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }

            const data = await res.json()
            
            if (data.success) {
                setMsg({
                    text: data.message || "Password set successfully!",
                    type: "success"
                })
            
                // Update cookie so PasswordHash is no longer null
                const userCookie = Cookies.get("user")
                if (userCookie) {
                    try {
                        const parsedUser = JSON.parse(userCookie)
                        parsedUser.PasswordHash = data.PasswordHash   // <-- NEW HASH
            
                        Cookies.set("user", JSON.stringify(parsedUser), {
                            expires: 7,
                            path: "/"
                        })
            
                        console.log("Updated cookie:", parsedUser)
                    } catch (e) {
                        console.error("Cookie parse error:", e)
                    }
                }
            
                setPassword("")
                setConfirm("")
            
                // Refresh UI so SetPassword → UpdatePassword
                window.location.reload()
            }
             else {
                setMsg({ 
                    text: data.message || "Failed to set password", 
                    type: "error" 
                })
            }
        } catch (error) {
            console.error("Set password error:", error)
            setMsg({ 
                text: "Network error. Please try again.", 
                type: "error" 
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
                <p className="text-gray-600 mt-2">Create a secure password for your account</p>
            </div>

            <form onSubmit={handleSetPassword} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Password strength:</span>
                            <span className={`font-medium ${
                                passwordStrength < 40 ? "text-red-600" :
                                passwordStrength < 70 ? "text-yellow-600" :
                                "text-green-600"
                            }`}>
                                {getStrengthText()}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                style={{ width: `${passwordStrength}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Password Requirements */}
                {password.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <p className="text-sm font-medium text-gray-700">Password must contain:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li className={`flex items-center ${requirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                                <span className="mr-2">{requirements.length ? '✓' : '○'}</span>
                                At least 8 characters
                            </li>
                            <li className={`flex items-center ${requirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                <span className="mr-2">{requirements.uppercase ? '✓' : '○'}</span>
                                One uppercase letter
                            </li>
                            <li className={`flex items-center ${requirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                                <span className="mr-2">{requirements.lowercase ? '✓' : '○'}</span>
                                One lowercase letter
                            </li>
                            <li className={`flex items-center ${requirements.number ? 'text-green-600' : 'text-gray-400'}`}>
                                <span className="mr-2">{requirements.number ? '✓' : '○'}</span>
                                One number
                            </li>
                            <li className={`flex items-center ${requirements.special ? 'text-green-600' : 'text-gray-400'}`}>
                                <span className="mr-2">{requirements.special ? '✓' : '○'}</span>
                                One special character
                            </li>
                        </ul>
                    </div>
                )}

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || password === "" || confirm === ""}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        loading || password === "" || confirm === ""
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Setting Password...
                        </div>
                    ) : (
                        "Set Password"
                    )}
                </button>

                {/* Message */}
                {msg.text && (
                    <div className={`p-4 rounded-lg text-center ${
                        msg.type === "success" 
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : msg.type === "error"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                        {msg.text}
                    </div>
                )}
            </form>

            {/* Security Tips */}
            <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    💡 <strong>Tip:</strong> Use a unique password that you don't use on other sites. 
                    Consider using a password manager to generate and store secure passwords.
                </p>
            </div>
        </div>
    )
}
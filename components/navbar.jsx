"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Search, Menu, LogOut, User } from "lucide-react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"


export default function Navbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove("user")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        
        <div className="flex items-center gap-3 w-full max-w-lg">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          <div className="hidden sm:flex items-center w-full bg-gray-100 rounded-lg px-3 py-2">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, vendors, users..."
              className="ml-2 w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        
        <div className="flex items-center gap-4 sm:gap-6 relative">
          <button className="relative">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px]">
              3
            </span>
          </button>

          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold focus:outline-none hover:ring-2 hover:ring-blue-400 transition"
            >
              AD
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
               
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full cursor-pointer bg-blue-500 text-white flex items-center justify-center font-semibold">
                      AD
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                  </div>
                </div>

               
                <div className="py-2">
                  <button 
                  onClick={() => router.push("/settings")}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    <User className="h-4 w-4 text-gray-500" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

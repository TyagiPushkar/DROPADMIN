"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  LogOut,
  User,
  Bell,
  Search,
  ChevronDown,
  Sun,
  Moon,
  HelpCircle,
  Settings,
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Navbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Load user from cookie
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, []);

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    router.push("/");
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm backdrop-blur-lg bg-white/95">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          {/* Search Bar */}
          {/* <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 w-64">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search orders, vendors, riders..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400"
            />
          </div> */}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Time and Date */}
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-gray-900">
              {currentTime}
            </span>
            <span className="text-xs text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Dark Mode Toggle */}
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-gray-700" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button> */}

          {/* Help */}
          {/* <button
            onClick={() => router.push("/help")}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <HelpCircle className="h-5 w-5 text-gray-700" />
          </button> */}

          {/* Notifications */}
          {/* <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setDropdownOpen(false);
              }}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <Bell className="h-5 w-5 text-gray-700" />
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500">You have 3 new alerts</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center">
                          <Bell className="h-4 w-4 text-cyan-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            New order received
                          </p>
                          <p className="text-xs text-gray-500">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium w-full text-center py-2">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div> */}

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {getGreeting()},{" "}
                  <span className="text-cyan-600">
                    {user?.FullName?.split(" ")[0] || "Admin"}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {user?.Role || "Administrator"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {getInitials(user?.FullName)}
                </span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {getInitials(user?.FullName)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user?.FullName || "Administrator"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.Email || "admin@dropdash.com"}
                      </p>
                      <div className="mt-1 px-2 py-1 bg-cyan-50 text-cyan-700 rounded-md inline-block text-xs font-medium">
                        {user?.Role || "Super Admin"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    My Profile
                  </button>
                  <button
                    onClick={() => router.push("/settings")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    Account Settings
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
  );
}

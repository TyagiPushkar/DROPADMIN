"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, Bell, ChefHat, LogOut } from "lucide-react"
import Cookies from "js-cookie"
import { useOrderModal } from "./orderModalProvider"
import { useRouter } from "next/navigation"

export default function Navbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(null);
  const { openOrderModal } = useOrderModal();
  const [user, setUser] = useState(null);
  const router = useRouter();

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

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.wav");
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      if (!audioRef.current) return;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          console.log("🔓 Audio unlocked");
        })
        .catch(() => console.log("💥 Unlock failed"));

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  // In your Navbar component, update the useEffect for WebSocket:

  useEffect(() => {
    // Use your server's IP directly
     const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://62.72.12.37:6011";
     let socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WS Connected to 62.72.12.37:6010");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "new_order" && data.restaurant_id) {
        setNotifications((prev) => [
          { id: Date.now(), text: data.message },
          ...prev,
        ]);
        openOrderModal({
          order_id: data.order_id,
          message: data.message,
        });

        // Play sound
        const sound = new Audio("/sounds/notification.wav");
        sound.play().catch((err) => console.log("Sound blocked:", err));
      }
    };

    socket.onclose = () => {
      console.log("WS Closed");
    };

    return () => {
      console.log("Cleaning up WebSocket");
      socket.close();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    Cookies.remove("user");
    router.push("/");
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200 cursor-pointer"
          >
            <Menu size={20} className="text-gray-700" />
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 rounded-2xl border border-blue-100 shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <ChefHat size={16} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-800">
                Hello, Vendor!
              </span>
              <p className="text-xs text-gray-600">Welcome back 👋</p>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="hidden md:block flex-1 text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Restaurant Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your restaurant efficiently
          </p>
        </div>

        {/* Right Section - Notifications & Logout */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200 hover:shadow-md cursor-pointer group"
            >
              <Bell
                size={20}
                className="text-gray-700 group-hover:text-blue-600 transition-colors"
              />

              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 max-h-80 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Bell size={18} className="text-blue-500" />
                    Notifications
                    {notifications.length > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </h2>
                </div>

                {/* Notifications List */}
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell size={22} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium text-sm">
                      No notifications
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      You're all caught up!
                    </p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((note) => (
                      <div
                        key={note.id}
                        className="px-5 py-3 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <p className="text-sm text-gray-800">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(note.id).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative group">
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-md cursor-pointer group"
              title="Logout"
            >
              <LogOut
                size={20}
                className="text-red-500 group-hover:text-red-600 transition-colors"
              />
            </button>

            <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Logout
              <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

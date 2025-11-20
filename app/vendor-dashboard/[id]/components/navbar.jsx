"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, Bell, ChefHat } from "lucide-react"

export default function Navbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])  // <-- STORE NOTIFS
  const notificationsRef = useRef(null)

  // ------------------------------------------
  // 🚀 CONNECT TO WEBSOCKET SERVER
  // ------------------------------------------
  const audioRef = useRef(null);

useEffect(() => {
  audioRef.current = new Audio("/sounds/notification.wav");
}, []);

useEffect(() => {
  const unlockAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.play()
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


  
  
  useEffect(() => {
    let socket = new WebSocket("ws://localhost:8080");
  
    socket.onopen = () => {
      console.log("WS Connected");
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
    
      
    
      if (data.type === "new_order" && data.restaurant_id ) {
    
        // Add to list
        setNotifications(prev => [
          { id: Date.now(), text: data.message },
          ...prev
        ]);
    
        // Play sound
        if (audioRef.current) {
          audioRef.current.play().catch(err => console.log("Sound blocked:", err));
        }
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
  

  // close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200"
          >
            <Menu size={20} className="text-gray-700" />
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <ChefHat size={16} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-800">Hello, Vendor!</span>
              <p className="text-xs text-gray-600">Welcome back 👋</p>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <div className="hidden md:block flex-1 text-center">
          <h1 className="text-xl font-bold text-gray-800">
            Restaurant Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">Manage your restaurant efficiently</p>
        </div>

        {/* RIGHT — Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200"
          >
            <Bell size={20} className="text-gray-700" />

            {/* 🔴 RED DOT IF NEW NOTIFICATIONS */}
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* DROPDOWN */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-auto">
              
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Notifications</h2>
              </div>

              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell size={20} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No notifications</p>
                </div>
              ) : (
                notifications.map(note => (
                  <div key={note.id} className="px-4 py-3 border-b last:border-b-0">
                    <p className="text-gray-800">{note.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(note.id).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

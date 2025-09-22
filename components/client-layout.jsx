"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "./sidebar"
import Navbar from "./navbar"

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isLoginPage = pathname === "/"

  if (isLoginPage) {
    
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="flex">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}

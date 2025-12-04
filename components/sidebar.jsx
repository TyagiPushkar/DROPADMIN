"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, ShoppingCart, Package, Users, Settings, X } from "lucide-react"

const menuItems = [
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Vendors", href: "/vendors", icon: Package },
   { name: "Riders", href: "/riders", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar({ open, setOpen }) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

 
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-64 shadow-lg flex flex-col text-white z-30
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
        style={{ backgroundColor: "#06a8edff" }}
      >
        <div className="flex items-center justify-between p-6 font-bold text-2xl tracking-wide border-b border-blue-500">
          Drop Admin
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <nav className="flex-1 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg mx-4 mb-2 text-sm font-medium transition-all
                  ${isActive 
                    ? "bg-white text-blue-700 shadow-md" 
                    : "hover:bg-white/20 hover:text-gray-800"}`
                }
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-700" : "text-black"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
        />
      )}
    </>
  );
}

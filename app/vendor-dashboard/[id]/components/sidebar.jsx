"use client"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Home, ShoppingCart, Utensils, X } from "lucide-react"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export default function Sidebar({ isOpen, onClose }) {
  const { id } = useParams()
  const pathname = usePathname()
  const [user, setUser] = useState(null)

  // Fetch user data from cookies
  useEffect(() => {
    const userData = Cookies.get("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (e) {
        console.error("Failed to parse user cookie:", e)
      }
    }
  }, [])

  const menuItems = [
    { name: "Dashboard", href: `/vendor-dashboard/${id}`, icon: Home },
    { name: "Orders", href: `/vendor-dashboard/${id}/orders`, icon: ShoppingCart },
    { name: "Menu", href: `/vendor-dashboard/${id}/menu`, icon: Utensils },
  ]

  // Fix active state: Dashboard should only be active on exact match
  const isActive = (href) => {
    if (href === `/vendor-dashboard/${id}`) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // Get user name with fallback
  const getUserName = () => {
    if (user?.Name) return user.Name
    if (user?.FullName) return user.FullName
    if (user?.username) return user.username
    return "Restaurant Owner"
  }

  // Get user email with fallback
  const getUserEmail = () => {
    if (user?.Email) return user.Email
    if (user?.email) return user.email
    return "owner@restaurant.com"
  }

  // Get user initial for avatar
  const getUserInitial = () => {
    const name = getUserName()
    return name.charAt(0).toUpperCase()
  }

  return (
    <>
      {isOpen && (
        <div className="fixed lg:hidden inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl 
        transform transition-transform duration-300 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Vendor Panel</h2>
              <p className="text-xs text-gray-500">Restaurant #{id}</p>
            </div>

            <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-hidden">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${active 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer - Always visible with user data */}
          <div className="flex-shrink-0 p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold text-sm">
                {getUserInitial()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {getUserName()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {getUserEmail()}
                </p>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  )
}
import { Bell, Search, Menu } from "lucide-react"

export default function Navbar({ onMenuClick }) {
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

        <div className="flex items-center gap-4 sm:gap-6">
          <button className="relative">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px]">
              3
            </span>
          </button>
          <div className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            AD
          </div>
        </div>
      </div>
    </header>
  )
}

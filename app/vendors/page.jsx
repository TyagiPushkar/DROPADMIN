"use client"

import { useState, useRef } from "react"
import { Search, Filter, RefreshCcw, Download } from "lucide-react"
import VendorStatus from "@/components/vendors/vendorStatus"
import RecentVendors from "@/components/vendors/recentVendors"

export default function VendorsPage() {
  const [filter, setFilter] = useState("All Vendors")
  const [search, setSearch] = useState("")

  const vendorsRef = useRef(null)

  return (
    <div className="space-y-6">
     
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600">
            Manage restaurants and food vendors on your platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => vendorsRef.current?.handleExport()}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <button
            onClick={() => vendorsRef.current?.handleRefresh()}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center w-full sm:w-1/2 max-w-md bg-gray-100 rounded-lg shadow-md px-5 py-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vendor name, cuisine type, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 w-full bg-transparent outline-none text-sm"
          />
        </div>

        <VendorStatus />

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Vendors</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending Approval</option>
            <option>Suspended</option>
          </select>

          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      
      <RecentVendors ref={vendorsRef} filter={filter} search={search} />
    </div>
  )
}

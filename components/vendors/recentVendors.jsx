"use client"

import {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle
} from "react"
import Link from "next/link"
import { Eye } from "lucide-react"


const RecentVendors = forwardRef(({ filter, search }, ref) => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchVendors = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("https://namami-infotech.com/DROP/src/restaurants/get_restaurants.php")
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`)
      const data = await res.json()
     
      if (data.success && Array.isArray(data.data)) setVendors(data.data)
      else setError(data.message || "Invalid API response")
    } catch (err) {
      console.error("Failed to fetch vendors:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  
  const filteredVendors = useMemo(() => {
    let result = vendors
    if (filter && filter !== "All Vendors") {
      result = result.filter(
        (v) => v.status?.toLowerCase() === filter.toLowerCase()
      )
    }
    if (search && search.trim() !== "") {
      const lower = search.toLowerCase()
      result = result.filter(
        (v) =>
          v.restaurant_name?.toLowerCase().includes(lower) ||
          v.email?.toLowerCase().includes(lower) ||
          v.owner_name?.toLowerCase().includes(lower) ||
          v.type?.toLowerCase().includes(lower) ||
          v.address?.toLowerCase().includes(lower) ||
          v.city?.toLowerCase().includes(lower)
      )
    }
    return result
  }, [vendors, filter, search])

  // 💾 Export CSV
  const handleExport = () => {
    const header = [
      "Vendor Name",
      "Type",
      "Email",
      "Owner Name",
      "Phone",
      "Price for Two",
      "Area",
      "City"
    ]
    const rows = filteredVendors.map((v) => [
      v.restaurant_name || "",
      v.type || "",
      v.email || "",
      v.owner_name || "",
      v.phone || "",
      v.avg_cost_for_two || "",
      v.address || "",
      v.city || ""
    ])
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((r) => r.join(",")).join("\n")

    const link = document.createElement("a")
    link.href = encodeURI(csvContent)
    link.download = "vendors.csv"
    link.click()
  }

  const handleRefresh = () => fetchVendors()

  useImperativeHandle(ref, () => ({ handleExport, handleRefresh }))

  if (loading)
    return <div className="p-6 text-gray-600 text-center">Loading vendors...</div>

  if (error)
    return <div className="p-6 text-red-600 text-center">Failed to load: {error}</div>

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Vendor Directory</h2>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3">Vendor Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Price for Two</th>
              <th className="px-6 py-3">City</th>
              <th className="px-6 py-3">Verified</th>
               <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
  {filteredVendors.map((v) => (
    <tr key={v.restaurant_id} className="hover:bg-gray-50">
      <td className="px-6 py-4 font-medium text-gray-900">{v.name}</td>
      <td className="px-6 py-4">{v.type || "-"}</td>
      <td className="px-6 py-4">{v.email || "-"}</td>
      <td className="px-6 py-4">{v.owner_name || "-"}</td>
      <td className="px-6 py-4">{v.phone || "-"}</td>
      <td className="px-6 py-4">{v.avg_cost_for_two || "-"}</td>
      <td className="px-6 py-4">{v.city || "-"}</td>

      <td className="px-6 py-4 text-center">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={v.is_verified == 1}
            onChange={async (e) => {
              const newStatus = e.target.checked ? 1 : 0

              // Optimistically update UI
              setVendors((prev) =>
                prev.map((x) =>
                  x.restaurant_id === v.restaurant_id
                    ? { ...x, is_verified: newStatus }
                    : x
                )
              )

              try {
                const res = await fetch(
                  "https://namami-infotech.com/DROP/src/restaurants/update_verification.php",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      restaurant_id: v.restaurant_id,
                      is_verified: newStatus,
                    }),
                  }
                )
                const data = await res.json()
                if (!data.success) {
                  alert("Failed: " + data.message)
                }
              } catch (err) {
                console.error("Update failed:", err)
                alert("Error updating verification.")
              }
            }}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-300 peer-checked:bg-green-500 rounded-full relative transition">
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
          </div>
        </label>
      </td>
      <td className="px-6 py-4 text-center">
        <Link
          href={`/vendors/${v.restaurant_id}`}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          <Eye className="h-4 w-4 text-gray-600" />
        </Link>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden divide-y divide-gray-200">
        {filteredVendors.map((v) => (
          <div key={v.restaurant_id} className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">{v.restaurant_name}</span>
              <span className="text-sm text-gray-500">{v.city}</span>
            </div>
            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <p><strong>Type:</strong> {v.type || "-"}</p>
              <p><strong>Email:</strong> {v.email || "-"}</p>
              <p><strong>Phone:</strong> {v.phone || "-"}</p>
              <p><strong>Price for Two:</strong> {v.avg_cost_for_two || "-"}</p>
              <p><strong>Area:</strong> {v.address || "-"}</p>
            </div>
            <Link
  href={`/vendors/${v.restaurant_id}`}
  className="text-blue-600 hover:text-blue-800 p-2 inline-flex items-center justify-center rounded-full hover:bg-blue-50 transition"
>
  <Eye className="w-5 h-5" />
</Link>

          </div>
        ))}
      </div>
    </div>
  )
})

RecentVendors.displayName = "RecentVendors"
export default RecentVendors

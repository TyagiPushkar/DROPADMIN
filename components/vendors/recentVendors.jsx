"use client"

import { forwardRef, useState, useEffect, useMemo, useImperativeHandle } from "react"

const RecentVendors = forwardRef(({ filter, search }, ref) => {
  const [vendors, setVendors] = useState([])
  

  
  const fetchVendors = async () => {
    try {
      const res = await fetch(`https://namami-infotech.com/DROP/src/restaurants/get_restaurants.php`)
      const data = await res.json()
      if (data.success) setVendors(data.data)
    } catch (err) {
      console.error("Failed to fetch vendors:", err)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  
  const filteredVendors = useMemo(() => {
    let result = vendors

    if (filter && filter !== "All Vendors") {
      result = result.filter((v) => v.status?.toLowerCase() === filter.toLowerCase())
    }

    if (search && search.trim() !== "") {
      const lower = search.toLowerCase()
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(lower) ||
          (v.cuisines?.join(", ").toLowerCase() || "").includes(lower) ||
          v.area.toLowerCase().includes(lower)
      )
    }

    return result
  }, [vendors, filter, search])

  
  const handleExport = () => {
    const header = [
      "Vendor Name",
      "Description",
      "Website",
      "Phone",
      "Price for Two",
      "Area",
      "City",
    ]
    const rows = filteredVendors.map((v) => [
      v.name,
      v.description,
      v.website,
      v.phone_number,
      v.avg_cost_for_two,
      v.area,
      v.city,
    ])
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((r) => r.join(",")).join("\n")
    const link = document.createElement("a")
    link.href = encodeURI(csvContent)
    link.download = "vendors.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  
  const handleRefresh = () => fetchVendors()

  useImperativeHandle(ref, () => ({ handleExport, handleRefresh }))

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Vendor Directory</h2>
      </div>

      
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3">Vendor Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Website</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Price for Two</th>
              <th className="px-6 py-3">Area</th>
              <th className="px-6 py-3">City</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVendors.map((v) => (
              <tr key={v.restaurant_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{v.name}</td>
                <td className="px-6 py-4">{v.description}</td>
                <td className="px-6 py-4">
                  <a href={v.website} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    {v.website}
                  </a>
                </td>
                <td className="px-6 py-4">{v.phone_number}</td>
                <td className="px-6 py-4">{v.avg_cost_for_two}</td>
                <td className="px-6 py-4">{v.area}</td>
                <td className="px-6 py-4">{v.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="sm:hidden divide-y divide-gray-200">
        {filteredVendors.map((v) => (
          <div key={v.restaurant_id} className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">{v.name}</span>
              <span className="text-sm text-gray-500">{v.city}</span>
            </div>
            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <p>{v.description}</p>
              <p>
                <strong>Website:</strong>{" "}
                <a href={v.website} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {v.website}
                </a>
              </p>
              <p>
                <strong>Phone:</strong> {v.phone_number}
              </p>
              <p>
                <strong>Price for Two:</strong> {v.avg_cost_for_two}
              </p>
              <p>
                <strong>Area:</strong> {v.area}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

RecentVendors.displayName = "RecentVendors"
export default RecentVendors

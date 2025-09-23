"use client"

import { Users, CheckCircle, Clock } from "lucide-react"
import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())


const statusConfig = [
  { key: "total", label: "Total", icon: Users, color: "text-blue-600 bg-blue-100" },
  { key: "active", label: "Active", icon: CheckCircle, color: "text-green-600 bg-green-100" },
  { key: "pending", label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-100" },
]

export default function VendorStatus() {
  const { data, error, isLoading } = useSWR(
    `https://namami-infotech.com/DROP/src/restaurants/get_single_restaurant.php?restaurant_id=1`,
    fetcher,
    { refreshInterval: 10000 }
  )

  if (error) return <div className="text-red-600 p-2 text-sm">Failed to load vendor status</div>
  if (isLoading) return <div className="text-gray-500 p-2 text-sm">Loading...</div>

 
  const counts = { total: 0, active: 0, pending: 0 }

  if (data?.success && data.data) {
    counts.total = 1 
    if (data.data.status === "active") counts.active = 1
    if (data.data.status === "pending") counts.pending = 1
  }

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {statusConfig.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm border border-gray-200 bg-white"
        >
          <div className={`p-1.5 rounded-full ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-gray-700">{label}:</span>
          <span className="font-semibold text-gray-900">{counts[key] || 0}</span>
        </div>
      ))}
    </div>
  )
}

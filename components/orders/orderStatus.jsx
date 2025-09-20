"use client"

import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

const statusConfig = [
  { key: "Placed", label: "Placed", icon: Package, color: "text-blue-600 bg-blue-100" },
  { key: "Preparing", label: "Preparing", icon: Clock, color: "text-yellow-600 bg-yellow-100" },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Truck, color: "text-purple-600 bg-purple-100" },
  { key: "Delivered", label: "Delivered", icon: CheckCircle, color: "text-green-600 bg-green-100" },
  { key: "Cancelled", label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-100" },
]

export default function OrderStatus() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const { data, error, isLoading } = useSWR(
    `${BASE_URL}/src/orders/get_order.php?role=admin`,
    fetcher,
    { refreshInterval: 10000 }
  )

  if (error) return <div className="text-red-600 p-2 text-sm">Failed to load status</div>
  if (isLoading) return <div className="text-gray-500 p-2 text-sm">Loading...</div>

  const counts = {}
  if (data?.success && Array.isArray(data.data)) {
    data.data.forEach(order => {
      const status = order.order_status
      counts[status] = (counts[status] || 0) + 1
    })
  }

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {statusConfig.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm border border-gray-200 bg-white`}
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

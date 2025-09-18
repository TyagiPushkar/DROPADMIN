"use client"

import { useEffect, useState } from "react"
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react"

const statusConfig = [
  { key: "Placed", label: "Placed", icon: Package, color: "bg-blue-100 text-blue-700" },
  { key: "Preparing", label: "Preparing", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Truck, color: "bg-purple-100 text-purple-700" },
  { key: "Delivered", label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-700" },
  { key: "Cancelled", label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-700" },
]

export default function OrderStatus() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://namami-infotech.com/DROP/src/orders/get_order.php?role=admin") 
        const json = await res.json()

        if (json.success) {
          const statusCount = {}
          json.data.forEach(order => {
            const status = order.order_status
            statusCount[status] = (statusCount[status] || 0) + 1
          })
          setCounts(statusCount)
        }
      } catch (err) {
        console.error("Error fetching orders:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
      {statusConfig.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="flex items-center gap-3 p-6 bg-white rounded-xl shadow border border-gray-200"
        >
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-xl font-bold text-gray-900">{counts[key] || 0}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

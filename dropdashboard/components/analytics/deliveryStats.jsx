"use client"

import { Clock, Truck, MapPin } from "lucide-react"

export default function DeliveryStats() {
  const stats = [
    {
      title: "Avg Delivery Time",
      value: "32 min",
      subtitle: "-5% from yesterday",
      icon: Clock,
      iconColor: "text-blue-500",
    },
    {
      title: "Active Drivers",
      value: "47",
      subtitle: "+3 from last hour",
      icon: Truck,
      iconColor: "text-green-500",
    },
    {
      title: "Coverage Areas",
      value: "12",
      subtitle: "All operational",
      icon: MapPin,
      iconColor: "text-purple-500",
    },
  ]

  return (
    <div className="rounded-lg  bg-white p-4 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">Delivery Stats</h2>
      <p className="text-sm text-gray-500 mb-4">Key delivery performance metrics</p>

      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="flex items-center space-x-3">
              <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { Star, Clock, TrendingUp, TrendingDown } from "lucide-react"

const vendorData = [
  {
    name: "Pizza Palace",
    rating: 4.8,
    orders: 156,
    revenue: 4250,
    avgDeliveryTime: 28,
    growth: 12.5,
    status: "excellent",
  },
  {
    name: "Burger Barn",
    rating: 4.6,
    orders: 134,
    revenue: 3890,
    avgDeliveryTime: 32,
    growth: 8.2,
    status: "good",
  },
  {
    name: "Sushi Spot",
    rating: 4.9,
    orders: 98,
    revenue: 5120,
    avgDeliveryTime: 25,
    growth: 15.3,
    status: "excellent",
  },
  {
    name: "Taco Time",
    rating: 4.3,
    orders: 87,
    revenue: 2340,
    avgDeliveryTime: 35,
    growth: -2.1,
    status: "needs-attention",
  },
  {
    name: "Pasta Point",
    rating: 4.7,
    orders: 112,
    revenue: 3650,
    avgDeliveryTime: 30,
    growth: 6.8,
    status: "good",
  },
]

function StatusBadge({ status }) {
  const styles = {
    excellent: "text-blue-600 border-blue-600",
    good: "text-green-600 border-green-600",
    "needs-attention": "text-red-600 border-red-600",
  }
  const labels = {
    excellent: "Excellent",
    good: "Good",
    "needs-attention": "Needs Attention",
  }
  return (
    <span className={`px-2 py-0.5 text-xs border rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export default function VendorPerformance() {
  return (
    <div className="rounded-lg  bg-white p-4 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">Vendor Performance</h2>
      <p className="text-sm text-gray-500 mb-4">Top performing vendors this week</p>

      <div className="space-y-6">
        {vendorData.map((vendor) => (
          <div key={vendor.name} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-gray-900">{vendor.name}</h3>
              <StatusBadge status={vendor.status} />
            </div>

            <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2">
              <span className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Rating: {vendor.rating}</span>
              </span>
              <span>Orders: {vendor.orders}</span>
              <span>Revenue: ${vendor.revenue}</span>
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Avg: {vendor.avgDeliveryTime}min</span>
              </span>
            </div>

            
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${Math.min((vendor.orders / 200) * 100, 100)}%` }}
              ></div>
            </div>

           
            <div className="flex justify-end mt-1 text-sm">
              {vendor.growth >= 0 ? (
                <span className="flex items-center text-blue-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{vendor.growth}%
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  {vendor.growth}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

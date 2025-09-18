"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 42000, orders: 1200 },
  { month: "Feb", revenue: 38000, orders: 1100 },
  { month: "Mar", revenue: 45000, orders: 1350 },
  { month: "Apr", revenue: 52000, orders: 1500 },
  { month: "May", revenue: 48000, orders: 1400 },
  { month: "Jun", revenue: 55000, orders: 1600 },
  { month: "Jul", revenue: 47892, orders: 1450 },
]

export default function RevenueTrend() {
  return (
    <div className="rounded-lg  bg-white/80 p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
      <p className="text-sm text-gray-500 mb-4">Monthly revenue over the last 7 months</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  Menu, Bell, User, LogOut, Bike, Users, DollarSign, MapPin, ArrowUpRight,
} from "lucide-react"
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, BarChart, Bar
} from "recharts"


const radialData = [{ name: "Completion", value: 78, fill: "#3b82f6" }]
const revenueTrend = [
  { day: "Mon", revenue: 8000 },
  { day: "Tue", revenue: 12000 },
  { day: "Wed", revenue: 10000 },
  { day: "Thu", revenue: 16000 },
  { day: "Fri", revenue: 18000 },
  { day: "Sat", revenue: 20000 },
  { day: "Sun", revenue: 15000 },
]
const paymentSplit = [
  { mode: "UPI", amount: 40000 },
  { mode: "Card", amount: 25000 },
  { mode: "Wallet", amount: 15000 },
  { mode: "Cash", amount: 10000 },
]
const topRiders = [
  { name: "Rohit", earnings: "₹12,500" },
  { name: "Meena", earnings: "₹10,800" },
  { name: "Arjun", earnings: "₹9,700" },
]
const activityFeed = [
  { text: "Driver Rohit picked up Ankit", status: "success" },
  { text: "Trip TRIP125 cancelled", status: "error" },
  { text: "₹200 payout released to Arjun", status: "info" },
]

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen flex bg-gray-50">
     
      <div className={`bg-white shadow-lg ${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={`text-xl font-bold text-blue-600 ${!sidebarOpen && "hidden"}`}>Drop Admin</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-4 text-gray-700">
          <SidebarItem icon={<Bike />} label="Riders" open={sidebarOpen} />
          <SidebarItem icon={<Users />} label="Customers" open={sidebarOpen} />
          <SidebarItem icon={<MapPin />} label="Trips" open={sidebarOpen} />
          <SidebarItem icon={<DollarSign />} label="Finance" open={sidebarOpen} />
        </nav>
      </div>

      
      <div className="flex-1 flex flex-col">
        
        <div className="bg-white shadow flex items-center justify-between px-6 py-4">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 rounded-lg w-1/3 focus:ring focus:ring-blue-300"
          />
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            <User className="w-6 h-6 text-gray-600 cursor-pointer" />
            <LogOut className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
        </div>

        
        <div className="p-6 space-y-6">
         
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <HeroStat
              label="Total Drivers"
              value="1,245"
              icon={<Bike className="w-5 h-5 text-blue-600" />}
              sub="+5% this week"
            />
            <HeroStat
              label="Customers"
              value="3,560"
              icon={<Users className="w-5 h-5 text-green-600" />}
              sub="+8% this month"
            />
            <HeroStat
              label="Active Trips"
              value="128"
              icon={<MapPin className="w-5 h-5 text-purple-600 animate-pulse" />}
              sub="Live now"
            />
            <HeroStat
              label="Today's Revenue"
              value="₹52,340"
              icon={<DollarSign className="w-5 h-5 text-yellow-600" />}
              sub={<span className="flex items-center text-green-600"><ArrowUpRight className="w-4 h-4" />12%</span>}
            />
          </div>

         
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
  <h2 className="font-semibold text-gray-800 mb-2">Trip Completion Rate</h2>
  <ResponsiveContainer width="100%" height={220}>
  <RadialBarChart
    cx="50%"
    cy="50%"
    innerRadius="70%"
    outerRadius="90%"
    barSize={14}
    data={[
      { name: "Total", value: 100, fill: "#e5e7eb" },
      { name: "Completed", value: 78, fill: "#3b82f6" },
    ]}
    startAngle={90}
    endAngle={-270}
  >
    <RadialBar minAngle={15} clockWise dataKey="value" />
    <Tooltip />
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-xl font-bold fill-gray-800"
    >
      78%
    </text>
  </RadialBarChart>
</ResponsiveContainer>
<p className="text-gray-600 text-sm mt-2">completed successfully</p>

</div>


         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="font-semibold text-gray-800 mb-2">Payment Breakdown</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={paymentSplit}>
                  <XAxis dataKey="mode" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="font-semibold text-gray-800 mb-2">Top Riders</h2>
              <ul className="space-y-3">
                {topRiders.map((rider, i) => (
                  <li key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <span className="font-medium">{rider.name}</span>
                    <span className="text-gray-600">{rider.earnings}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-800 mb-4">Live Activity</h2>
            <div className="space-y-4">
              {activityFeed.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className={`w-3 h-3 mt-1 rounded-full ${
                      a.status === "success"
                        ? "bg-green-500"
                        : a.status === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <p className="text-gray-700">{a.text}</p>
                </div>
              ))}
            </div>
          </div>

        
          <div className="bg-white rounded-xl shadow p-6 h-72 flex items-center justify-center text-gray-500">
            <MapPin className="w-6 h-6 mr-2" />
            <span>Map of Active Trips (Integrate Mapbox/Leaflet)</span>
          </div>
        </div>
      </div>
    </div>
  )
}


function SidebarItem({ icon, label, open }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition">
      {icon}
      {open && <span className="font-medium">{label}</span>}
    </div>
  )
}


function HeroStat({ icon, label, value, sub }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <span className="text-xs text-gray-500">{sub}</span>
    </div>
  )
}

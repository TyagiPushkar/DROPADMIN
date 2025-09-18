"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { day: "Mon", completed: 200, cancelled: 20 },
  { day: "Tue", completed: 300, cancelled: 25 },
  { day: "Wed", completed: 280, cancelled: 30 },
  { day: "Thu", completed: 350, cancelled: 22 },
  { day: "Fri", completed: 420, cancelled: 35 },
  { day: "Sat", completed: 500, cancelled: 40 },
  { day: "Sun", completed: 380, cancelled: 28 },
]

export default function WeeklyData() {
  return (
    <div className="rounded-lg  bg-white p-4 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">Weekly Orders</h2>
      <p className="text-sm text-gray-500 mb-4">Order completion vs cancellations for the past week</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#2563eb" barSize={30} />
          <Bar dataKey="cancelled" fill="#dc2626" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

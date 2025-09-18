"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const deliveryData = [
  { time: "9AM", avgTime: 25 },
  { time: "10AM", avgTime: 28 },
  { time: "11AM", avgTime: 32 },
  { time: "12PM", avgTime: 35 },
  { time: "1PM", avgTime: 38 },
  { time: "2PM", avgTime: 33 },
  { time: "3PM", avgTime: 30 },
  { time: "4PM", avgTime: 28 },
  { time: "5PM", avgTime: 31 },
  { time: "6PM", avgTime: 36 },
  { time: "7PM", avgTime: 42 },
  { time: "8PM", avgTime: 39 },
]

export default function DeliveryTimes() {
  return (
    <div className="rounded-lg  bg-white p-4 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">Delivery Times</h2>
      <p className="text-sm text-gray-500 mb-4">Average delivery time throughout the day</p>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={deliveryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avgTime" stroke="#9333ea" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

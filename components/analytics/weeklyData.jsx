"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BASE_URL } from "@/app/page"

export default function WeeklyData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
     

      const response = await fetch(
        `${BASE_URL}/orders/get_order.php?role=admin`
      )

      if (!response.ok) throw new Error("Failed to fetch orders")

      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        processWeeklyData(result.data)
      } else {
        throw new Error("Invalid data format")
      }
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const processWeeklyData = (orders) => {
    const today = new Date()
    const last7Days = new Date()
    last7Days.setDate(today.getDate() - 6)

    const weekMap = new Map()

    // Initialize all days with 0
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    dayNames.forEach((day) => {
      weekMap.set(day, { day, completed: 0, cancelled: 0 })
    })

    orders.forEach((order) => {
      const orderDate = new Date(order.created_at.replace(" ", "T"))

      if (orderDate >= last7Days && orderDate <= today) {
        const dayName = dayNames[orderDate.getDay()]

        if (
          order.payment_status === "Paid" &&
          order.order_status === "Delivered"
        ) {
          weekMap.get(dayName).completed += 1
        }

        if (order.order_status === "Cancelled") {
          weekMap.get(dayName).cancelled += 1
        }
      }
    })

    // Keep correct weekday order (Mon → Sun)
    const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const finalData = orderedDays.map(
      (day) => weekMap.get(day) || { day, completed: 0, cancelled: 0 }
    )

    setData(finalData)
  }

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">Weekly Orders</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">Weekly Orders</h2>
        <div className="h-64 flex items-center justify-center text-red-500">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">
        Weekly Orders (Last 7 Days)
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Completed vs Cancelled orders
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#2563eb" barSize={30} />
          <Bar dataKey="cancelled" fill="#dc2626" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
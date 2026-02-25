"use client"

import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BASE_URL } from "@/app/page"

const COLORS = ["#16a34a", "#dc2626", "#2563eb"]

export default function RestaurantStatusDistribution() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      

      const response = await fetch(
        `${BASE_URL}restaurants/get_restaurants.php`
      )

      if (!response.ok) throw new Error("Failed to fetch restaurants")

      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        processData(result.data)
      } else {
        throw new Error("Invalid data format")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const processData = (restaurants) => {
    let active = 0
    let inactive = 0
    let verified = 0

    restaurants.forEach((r) => {
      if (r.status === "active") active++
      else inactive++

      if (r.is_verified === 1) verified++
    })

    setData([
      { name: "Active", value: active },
      { name: "Inactive", value: inactive },
      { name: "Verified", value: verified },
    ])
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">
        Restaurant Status Distribution
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
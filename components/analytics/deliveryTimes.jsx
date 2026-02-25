"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { BASE_URL } from "@/app/page"

export default function CuisineDistribution() {
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
        processCuisineData(result.data)
      } else {
        throw new Error("Invalid data format")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const processCuisineData = (restaurants) => {
    const cuisineMap = new Map()

    restaurants.forEach((r) => {
      if (Array.isArray(r.cuisines)) {
        r.cuisines.forEach((cuisine) => {
          cuisineMap.set(
            cuisine,
            (cuisineMap.get(cuisine) || 0) + 1
          )
        })
      }
    })

    const formattedData = Array.from(cuisineMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    setData(formattedData)
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">
        Cuisine Distribution
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
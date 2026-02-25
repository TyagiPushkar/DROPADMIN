"use client"

import { useEffect, useState } from "react"
import { BASE_URL } from "@/app/page"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts"

export default function RiderApprovalTimeDistribution() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRiders()
  }, [])

  const fetchRiders = async () => {
    try {
      const response = await fetch(`${BASE_URL}rider/get_all_rider.php`)
      const result = await response.json()

      if (result.success) {
        processData(result.data)
      } else {
        throw new Error("Invalid response")
      }
    } catch (err) {
      setError("Failed to load riders")
    } finally {
      setLoading(false)
    }
  }

  const processData = (riders) => {
    const buckets = {
      "<1h": 0,
      "1-6h": 0,
      "6-24h": 0,
      "1-3d": 0,
      ">3d": 0,
    }

    riders.forEach((rider) => {
      if (rider.ApprovedOn && rider.AddedOn) {
        const added = new Date(rider.AddedOn.replace(" ", "T"))
        const approved = new Date(rider.ApprovedOn.replace(" ", "T"))

        const diffHours = (approved - added) / (1000 * 60 * 60)

        if (diffHours < 1) buckets["<1h"]++
        else if (diffHours < 6) buckets["1-6h"]++
        else if (diffHours < 24) buckets["6-24h"]++
        else if (diffHours < 72) buckets["1-3d"]++
        else buckets[">3d"]++
      }
    })

    const formatted = Object.entries(buckets).map(([range, count]) => ({
      range,
      count,
    }))

    setData(formatted)
  }

  if (loading)
    return <div className="p-6 text-gray-500">Loading approval data...</div>

  if (error)
    return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Rider Approval Time Distribution
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#9333ea">
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
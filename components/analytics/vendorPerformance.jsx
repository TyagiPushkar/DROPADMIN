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

export default function RiderWorkforceGraph() {
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
    const total = riders.length
    const approved = riders.filter(r => r.Status === "Approved").length
    const working = riders.filter(r => r.Working === 1).length
    const pending = riders.filter(r => r.Status === "Pending").length

    const complianceComplete = riders.filter(r =>
      r.PAN_IMAGE &&
      r.RC_IMAGE &&
      r.DrivingLicensePhotoURL
    ).length

    setData([
      { name: "Total", value: total },
      { name: "Approved", value: approved },
      { name: "Working", value: working },
      { name: "Pending", value: pending },
      { name: "Compliant", value: complianceComplete },
    ])
  }

  if (loading)
    return <div className="p-6 text-gray-500">Loading rider data...</div>

  if (error)
    return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Rider Workforce Overview
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb">
            <LabelList dataKey="value" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { BASE_URL } from "@/app/page"

export default function RidePerformanceSummary() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    try {
      const response = await fetch(`${BASE_URL}rides/get_all_rides.php`)
      const result = await response.json()

      if (result.success) {
        processData(result.data)
      }
    } finally {
      setLoading(false)
    }
  }

  const processData = (rides) => {
    const total = rides.length

    const completed = rides.filter(
      r => r.status === "payment_received"
    ).length

    const cancelled = rides.filter(
      r => r.status.includes("cancelled")
    ).length

    const cancellationRate =
      total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0

    const totalFare = rides.reduce(
      (sum, r) => sum + parseFloat(r.fare || 0),
      0
    )

    const avgFare =
      total > 0 ? (totalFare / total).toFixed(1) : 0

    const totalDistance = rides.reduce(
      (sum, r) => sum + parseFloat(r.distance_km || 0),
      0
    )

    const avgDistance =
      total > 0 ? (totalDistance / total).toFixed(2) : 0

    const otpVerified = rides.filter(
      r => r.otp_verified === 1
    ).length

    const otpRate =
      total > 0 ? ((otpVerified / total) * 100).toFixed(1) : 0

    setStats({
      total,
      completed,
      cancelled,
      cancellationRate,
      avgFare,
      avgDistance,
      otpRate,
    })
  }

  if (loading)
    return (
      <div className="p-8 text-gray-500 text-center">
        Loading ride analytics...
      </div>
    )

  if (!stats) return null

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Ride Performance Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Operational metrics across all rides
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <KpiCard
          title="Total Rides"
          value={stats.total}
          highlight
        />

        <KpiCard
          title="Completed"
          value={stats.completed}
          color="text-green-600"
        />

        <KpiCard
          title="Cancelled"
          value={stats.cancelled}
          color="text-red-600"
        />

        <KpiCard
          title="Cancellation Rate"
          value={`${stats.cancellationRate}%`}
          color={stats.cancellationRate > 25 ? "text-red-600" : "text-green-600"}
        />

        <KpiCard
          title="Average Fare"
          value={`₹${stats.avgFare}`}
        />

        <KpiCard
          title="Average Distance"
          value={`${stats.avgDistance} km`}
        />

        <KpiCard
          title="OTP Verified"
          value={`${stats.otpRate}%`}
          color={stats.otpRate < 90 ? "text-red-600" : "text-green-600"}
        />

      </div>
    </div>
  )
}

function KpiCard({ title, value, color = "text-gray-900", highlight }) {
  return (
    <div
      className={`rounded-lg p-5 transition hover:shadow-lg 
      ${highlight ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}
    >
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {title}
      </p>
      <h3 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h3>
    </div>
  )
}
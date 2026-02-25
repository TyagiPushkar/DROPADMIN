"use client"

import { useEffect, useState } from "react"
import { BASE_URL } from "@/app/page"

export default function RiderProductivityLeaderboard() {
  const [data, setData] = useState([])
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
    const riderMap = new Map()

    rides.forEach((ride) => {
      if (!riderMap.has(ride.rider_id)) {
        riderMap.set(ride.rider_id, {
          riderId: ride.rider_id,
          totalRides: 0,
          revenue: 0,
          cancelled: 0,
        })
      }

      const rider = riderMap.get(ride.rider_id)
      rider.totalRides++
      rider.revenue += parseFloat(ride.fare || 0)

      if (ride.status.includes("cancelled")) {
        rider.cancelled++
      }
    })

    const formatted = Array.from(riderMap.values())
      .map(r => ({
        ...r,
        avgFare: (r.revenue / r.totalRides).toFixed(1),
      }))
      .sort((a, b) => b.revenue - a.revenue)

    setData(formatted)
  }

  if (loading) return <div className="p-6">Loading rider leaderboard...</div>

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Rider Productivity Leaderboard
      </h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Rider ID</th>
            <th>Total Rides</th>
            <th>Revenue</th>
            <th>Avg Fare</th>
            <th>Cancelled</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rider, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 font-medium">{rider.riderId}</td>
              <td>{rider.totalRides}</td>
              <td>₹{rider.revenue.toFixed(1)}</td>
              <td>₹{rider.avgFare}</td>
              <td className="text-red-500">{rider.cancelled}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
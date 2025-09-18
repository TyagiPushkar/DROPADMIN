"use client"

const peakHours = [
  { time: "12:00 PM - 1:00 PM", orders: 187, revenue: 4250 },
  { time: "7:00 PM - 8:00 PM", orders: 165, revenue: 3890 },
  { time: "6:00 PM - 7:00 PM", orders: 134, revenue: 3120 },
]

export default function PeakHours() {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Peak Hours</h2>
      <p className="text-sm text-gray-500 mb-4">Busiest times today</p>
      <div className="space-y-2">
        {peakHours.map((slot, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b last:border-b-0 py-2"
          >
            <div>
              <p className="text-sm font-medium">{slot.time}</p>
              <p className="text-xs text-gray-500">{slot.orders} orders</p>
            </div>
            <p className="text-sm font-semibold">${slot.revenue}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

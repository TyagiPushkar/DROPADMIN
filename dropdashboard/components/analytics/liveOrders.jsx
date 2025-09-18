"use client"

const liveOrders = [
  { id: 1001, status: "Preparing", time: "2 min ago", amount: 25.99 },
  { id: 1002, status: "Out for delivery", time: "5 min ago", amount: 42.5 },
  { id: 1003, status: "Confirmed", time: "1 min ago", amount: 18.75 },
]

export default function LiveOrders() {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Live Orders</h2>
      <p className="text-sm text-gray-500 mb-4">Orders being processed right now</p>
      <div className="space-y-2">
        {liveOrders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center border-b last:border-b-0 py-2"
          >
            <div>
              <p className="font-medium text-sm">#{order.id}</p>
              <p className="text-xs text-gray-500">
                {order.status} • {order.time}
              </p>
            </div>
            <p className="text-sm font-semibold">${order.amount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

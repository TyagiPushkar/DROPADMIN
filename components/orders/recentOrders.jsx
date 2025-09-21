"use client"

import {
  forwardRef,
  useMemo,
  useImperativeHandle,
} from "react"
import { Eye, FileText, MapPin } from "lucide-react"
import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

const RecentOrders = forwardRef(({ filter, search }, ref) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/src/orders/get_order.php?role=admin`,
    fetcher,
    { refreshInterval: 10000 } 
  )

 
  const orders = data?.success ? data.data : []

 
  const filteredOrders = useMemo(() => {
    let result = orders

    if (filter && filter !== "All Orders") {
      result = result.filter((o) => o.order_status === filter)
    }

    if (search && search.trim() !== "") {
      const lower = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.order_id.toString().includes(lower) ||
          o.customer_name.toLowerCase().includes(lower) ||
          o.restaurant_name.toLowerCase().includes(lower)
      )
    }

    return result
  }, [orders, filter, search])

  
  const handleExport = () => {
    const header = [
      "Order ID",
      "Customer",
      "Phone",
      "Vendor",
      "Items",
      "Total",
      "Status",
      "Order Time",
    ]
    const rows = filteredOrders.map((o) => [
      o.order_id,
      o.customer_name,
      o.customer_phone,
      o.restaurant_name,
      o.items.map((i) => i.item_name).join(", "),
      o.total_amount,
      o.order_status,
      o.created_at,
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((r) => r.join(",")).join("\n")

    const link = document.createElement("a")
    link.href = encodeURI(csvContent)
    link.download = "orders.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

 
  const handleRefresh = () => {
    mutate() 
  }

  
  useImperativeHandle(ref, () => ({
    handleExport,
    handleRefresh,
  }))

  
  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return "bg-blue-100 text-blue-800"
      case "Preparing":
        return "bg-yellow-100 text-yellow-800"
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

 
  if (error) return <div className="p-4 text-red-600">Failed to load orders</div>
  if (isLoading) return <div className="p-4 text-gray-500">Loading orders...</div>

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
      </div>

      
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Vendor</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Order Time</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{order.order_id}
                </td>
                <td className="px-6 py-4">
                  <div>{order.customer_name}</div>
                  <div className="text-xs text-gray-500">
                    {order.customer_phone}
                  </div>
                </td>
                <td className="px-6 py-4">{order.restaurant_name}</td>
                <td className="px-6 py-4">
                  {order.items.map((i) => i.item_name).join(", ")}
                </td>
                <td className="px-6 py-4">₹{order.total_amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{order.created_at}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                    <MapPin className="h-4 w-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
      <div className="sm:hidden divide-y divide-gray-200">
        {filteredOrders.map((order) => (
          <div key={order.order_id} className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">
                #{order.order_id}
              </span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  order.order_status
                )}`}
              >
                {order.order_status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <p>
                <strong>Customer:</strong> {order.customer_name} (
                {order.customer_phone})
              </p>
              <p>
                <strong>Vendor:</strong> {order.restaurant_name}
              </p>
              <p>
                <strong>Items:</strong>{" "}
                {order.items.map((i) => i.item_name).join(", ")}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.total_amount}
              </p>
              <p className="text-gray-500">
                <strong>Order Time:</strong> {order.created_at}
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                <FileText className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                <MapPin className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

RecentOrders.displayName = "RecentOrders"
export default RecentOrders

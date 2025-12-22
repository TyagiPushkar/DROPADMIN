// "use client"

// import { useParams } from "next/navigation"
// import useSWR from "swr"
// import { Package, Clock, Truck, CheckCircle, XCircle, MapPin } from "lucide-react"
// import { BASE_URL } from "@/app/page"

// const fetcher = (url) => fetch(url).then((res) => res.json())

// const statusIcons = {
//   Placed: Package,
//   Preparing: Clock,
//   "Out for Delivery": Truck,
//   Delivered: CheckCircle,
//   Cancelled: XCircle,
// }

// export default function OrderDetailsPage() {
//   const { order_id } = useParams()

//   const { data, error, isLoading } = useSWR(
//     BASE_URL + `orders/get_order.php?role=admin&order_id=${order_id}`,
//     fetcher
//   )
  

//   if (isLoading)
//     return <div className="p-6 text-gray-600 text-center">Loading order details...</div>
//   if (error || !data?.success)
//     return (
//       <div className="p-6 text-red-600 text-center">
//         Failed to load order: {error?.message || data?.message}
//       </div>
//     )

//   const order = data.data?.[0]
//   if (!order) return <div className="p-6 text-gray-600 text-center">Order not found</div>

//   const StatusIcon = statusIcons[order.order_status] || Package

//   return (
//     <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mt-4">
//       <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order #{order.order_id}</h1>
//       <div className="flex items-center gap-3 mb-4">
//         <div className="p-2 rounded-full bg-gray-100">
//           <StatusIcon className="w-5 h-5 text-blue-600" />
//         </div>
//         <span className="text-gray-800 font-medium">
//           Status: <span className="text-blue-600">{order.order_status}</span>
//         </span>
//       </div>

//       <div className="border-t pt-4">
//         <h2 className="text-lg font-semibold text-gray-800 mb-2">Customer Details</h2>
//         <p><strong>Name:</strong> {order.customer_name}</p>
//         <p><strong>Phone:</strong> {order.customer_phone}</p>
//         <p className="flex items-center gap-1">
//           <MapPin className="w-4 h-4 text-gray-500" /> {order.delivery_address}
//         </p>
//       </div>

//       <div className="border-t pt-4 mt-4">
//         <h2 className="text-lg font-semibold text-gray-800 mb-2">Restaurant</h2>
//         <p><strong>Name:</strong> {order.restaurant_name}</p>
//         <p><strong>Restaurant ID:</strong> {order.restaurant_id}</p>
//       </div>

//       <div className="border-t pt-4 mt-4">
//         <h2 className="text-lg font-semibold text-gray-800 mb-2">Payment</h2>
//         <p><strong>Method:</strong> {order.payment_method}</p>
//         <p><strong>Status:</strong> {order.payment_status}</p>
//         <p><strong>Total:</strong> ₹{order.total_amount}</p>
//       </div>

//       <div className="border-t pt-4 mt-4">
//         <h2 className="text-lg font-semibold text-gray-800 mb-2">Delivery</h2>
//         <p><strong>Agent:</strong> {order.delivery_agent || "Not Assigned"}</p>
//         <p><strong>Agent Phone:</strong> {order.delivery_phone || "N/A"}</p>
//       </div>

//       <div className="border-t pt-4 mt-4">
//         <h2 className="text-lg font-semibold text-gray-800 mb-2">Items</h2>
//         <ul className="list-disc ml-6 space-y-1">
//           {order.items?.map((item, idx) => (
//             <li key={idx}>
//               {item.name} × {item.quantity} — ₹{item.price}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="text-sm text-gray-500 mt-6">
//         <p><strong>Created:</strong> {order.created_at}</p>
//         <p><strong>Last Updated:</strong> {order.updated_at}</p>
//       </div>
//     </div>
//   )
// }

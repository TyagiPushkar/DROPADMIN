"use client"
import React, { useEffect, useState } from "react";

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://namami-infotech.com/DROP/src/orders/get_order.php?role=admin")
      .then((res) => res.json())
      .then((data) => {
        console.log("Raw API data:", data);
  
        // Access the array inside data.data
        const ordersArray = data.data || [];
        const filtered = ordersArray.filter((o) => Number(o.restaurant_id) === 1);
  
        console.log("Filtered data (restaurant_id = 1):", filtered);
  
        setOrders(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);
  
  

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  const totalOrders = orders.length;
  const completed = orders.filter((o) => o.order_status === "Completed").length;
  const pending = orders.filter((o) => o.order_status === "Placed").length;
  const cancelled = orders.filter((o) => o.order_status === "Cancelled").length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + parseFloat(o.total_amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Restaurant Dashboard – ID 1
      </h1>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-gray-500 text-sm">Total Orders</h2>
          <p className="text-3xl font-semibold">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-gray-500 text-sm">Completed</h2>
          <p className="text-3xl font-semibold text-green-600">{completed}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-gray-500 text-sm">Pending</h2>
          <p className="text-3xl font-semibold text-yellow-500">{pending}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-gray-500 text-sm">Cancelled</h2>
          <p className="text-3xl font-semibold text-red-500">{cancelled}</p>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl p-6 shadow mb-10">
        <h2 className="text-gray-600 text-lg font-semibold mb-2">
          Total Revenue
        </h2>
        <p className="text-4xl font-bold text-blue-600">
          ₹{totalRevenue.toFixed(2)}
        </p>
      </div>

      
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.order_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{o.order_id}</td>
                  <td className="p-3">
                    {o.customer_name} <br />
                    <span className="text-xs text-gray-500">
                      {o.customer_phone}
                    </span>
                  </td>
                  <td className="p-3">₹{o.total_amount}</td>
                  <td className="p-3">{o.payment_method}</td>
                  <td
                    className={`p-3 font-semibold ${
                      o.order_status === "Completed"
                        ? "text-green-600"
                        : o.order_status === "Cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {o.order_status}
                  </td>
                  <td className="p-3">{o.created_at.split(" ")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

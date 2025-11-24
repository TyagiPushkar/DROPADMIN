"use client";
import { createContext, useContext, useState } from "react";

const OrderModalContext = createContext();

export function OrderModalProvider({ children }) {
  const [orderData, setOrderData] = useState(null);

  const openOrderModal = (data) => setOrderData(data);
  const closeOrderModal = () => setOrderData(null);

  return (
    <OrderModalContext.Provider value={{ openOrderModal }}>
      {children}

      {orderData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white to-gray-50 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100 transform transition-all duration-200 scale-100">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">📦</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                New Order #{orderData.order_id}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-2"></div>
            </div>

            {/* Message */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-gray-700 text-center leading-relaxed">
                {orderData.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  await updateStatus(orderData.order_id, "Preparing");
                  closeOrderModal();
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
              >
                ✅ Accept Order
              </button>

              <button
                onClick={async () => {
                  await updateStatus(orderData.order_id, "Cancelled");
                  closeOrderModal();
                }}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
              >
                ❌ Reject Order
              </button>

              <button
                onClick={closeOrderModal}
                className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
              >
                ⏳ Review Later
              </button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-gray-400 text-center mt-4">
              This action will update the order status immediately
            </p>
          </div>
        </div>
      )}
    </OrderModalContext.Provider>
  );
}

export function useOrderModal() {
  return useContext(OrderModalContext);
}

async function updateStatus(order_id, status) {
  await fetch("https://namami-infotech.com/DROP/src/orders/update_order_status.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id, order_status: status }),
  });
}
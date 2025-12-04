"use client";
import { BASE_URL } from "@/app/page";
import { createContext, useContext, useState, useEffect } from "react";

const OrderModalContext = createContext();

export function OrderModalProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  const openOrderModal = async (data) => {
    const res = await fetch(
      BASE_URL+`orders/get_order_items.php?order_id=${data.order_id}`
    );
    const items = await res.json();
  
    setQueue((prev) => [...prev, { ...data, items }]);
  };
  

  const closeOrderModal = () => {
    setQueue((prev) => prev.slice(1));
    setActiveOrder(null);
  };

 
  useEffect(() => {
    if (!activeOrder && queue.length > 0) {
      setActiveOrder(queue[0]);
    }
  }, [queue, activeOrder]);

  return (
    <OrderModalContext.Provider value={{ openOrderModal }}>
      {children}

      {activeOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white to-gray-50 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100">

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">
                New Order #{activeOrder.order_id}
              </h2>
            </div>
            <div className="mb-6">
  <h3 className="font-semibold text-lg mb-2">Ordered Items</h3>

  <ul className="space-y-2">
    {activeOrder.items?.map((item, idx) => (
      <li key={idx} className="flex justify-between text-gray-700">
        <span>{item.item_name} × {item.quantity}</span>
        <span>₹{item.price}</span>
      </li>
    ))}
  </ul>
</div>


            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  await updateStatus(activeOrder.order_id, "Preparing");
                  closeOrderModal();
                }}
                className="bg-green-600 cursor-pointer text-white py-3 rounded-xl"
              >
                ✅ Accept Order
              </button>

              <button
                onClick={async () => {
                  await updateStatus(activeOrder.order_id, "Cancelled");
                  closeOrderModal();
                }}
                className="bg-red-600 cursor-pointer text-white py-3 rounded-xl"
              >
                ❌ Reject Order
              </button>

              <button
                onClick={closeOrderModal}
                className="bg-gray-500 cursor-pointer text-white py-3 rounded-xl"
              >
                ⏳ Review Later
              </button>
            </div>
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
  await fetch(BASE_URL+"orders/update_order_status.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id, order_status: status }),
  });
}

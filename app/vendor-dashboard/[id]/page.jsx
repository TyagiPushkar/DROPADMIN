"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import { useParams } from "next/navigation";
import { OrderModalProvider } from "./components/orderModalProvider";
import Cookies from "js-cookie";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  Utensils,
  CheckCircle,
  XCircle,
  ChefHat,
  Package,
  IndianRupee
} from "lucide-react";
import { BASE_URL } from "@/app/page";

const RESTAURANT_API = BASE_URL+"restaurants/get_restaurants.php";
const MENU_API = BASE_URL+"restaurants/get_menu.php";
const ORDERS_API = BASE_URL+"orders/get_order.php";

export default function DashboardHome() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return;
    try {
      setUser(JSON.parse(cookie));
    } catch {
      console.error("User cookie parse failed");
    }
  }, []);

  useEffect(() => {
    if (!user?.Email) return;
    async function fetchRestaurant() {
      try {
        const res = await fetch(RESTAURANT_API);
        const data = await res.json();
        const restaurants = data.restaurants || data.data || [];
        const emailFields = ["email", "owner_email", "restaurant_email", "contact_email", "Email"];
        const found = restaurants.find((r) =>
          emailFields.some(
            (field) => r[field]?.trim().toLowerCase() === user.Email.trim().toLowerCase()
          )
        );
        if (found) {
          setRestaurantId(found.restaurant_id || found.id);
        }
      } catch (err) {
        console.error("Restaurant fetch error:", err);
      }
    }
    fetchRestaurant();
  }, [user]);

  useEffect(() => {
    if (!restaurantId) return;
    async function loadMenu() {
      try {
        const res = await fetch(`${MENU_API}?restaurant_id=${restaurantId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setMenu(data.data);
        } else {
          setMenu([]);
        }
      } catch {
        setMenu([]);
      }
    }
    loadMenu();
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId) return;
    async function loadOrders() {
      setLoading(true);
      try {
        const res = await fetch(
          `${ORDERS_API}?role=admin&restaurant_id=${restaurantId}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        const list = data.orders || data.data || [];
        setOrders(Array.isArray(list) ? list : []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [restaurantId]);

  // Dashboard metrics calculations
  const totalEarnings = useMemo(() => {
    return orders
      .filter((o) => ["delivered", "completed"].includes(o.order_status?.toLowerCase()))
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  }, [orders]);

  // Filter recent orders to only show preparing, placed, and out for delivery
  const recentOrders = useMemo(() => {
    const activeStatuses = ['preparing', 'placed', 'out for delivery'];
    return [...orders]
      .filter(order => 
        activeStatuses.includes(order.order_status?.toLowerCase())
      )
      .sort((a, b) => new Date(b.order_time || b.created_at) - new Date(a.order_time || a.created_at))
      .slice(0, 5);
  }, [orders]);

  const mostOrderedDish = useMemo(() => {
    if (!orders.length) return null;
    const count = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        count[item.menu_id] = (count[item.menu_id] || 0) + Number(item.quantity || 1);
      });
    });
    const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
    if (!top) return null;
    const dish = menu.find((m) => m.menu_id == top[0]);
    return dish ? { name: dish.item_name, count: top[1] } : null;
  }, [orders, menu]);

  const orderStatusCounts = useMemo(() => {
    const statuses = {
      preparing: 0,
      placed: 0,
      delivered: 0,
      cancelled: 0,
      'out for delivery': 0
    };
    
    orders.forEach(order => {
      const status = order.order_status?.toLowerCase();
      if (status in statuses) {
        statuses[status]++;
      }
    });
    
    return statuses;
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter(order => 
      !['delivered', 'completed', 'cancelled'].includes(order.order_status?.toLowerCase())
    ).length;
  }, [orders]);

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      'placed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-yellow-100 text-yellow-800',
      'out for delivery': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "delivered" || statusLower === "completed") return <CheckCircle className="w-4 h-4" />;
    if (statusLower === "cancelled") return <XCircle className="w-4 h-4" />;
    if (statusLower === "preparing") return <ChefHat className="w-4 h-4" />;
    if (statusLower === "out for delivery") return <Package className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <OrderModalProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="flex-1 flex flex-col">
          <Navbar setOpen={setOpen} />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's your business overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Earnings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(totalEarnings)}
                    </p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      All time revenue
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <IndianRupee className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {orders.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">All time orders</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Active Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {activeOrders}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Need attention</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Most Popular Dish */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Most Popular</p>
                    <p className="text-xl font-bold text-gray-900 mt-2 truncate">
                      {mostOrderedDish?.name || "No data"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {mostOrderedDish ? `${mostOrderedDish.count} orders` : "Not enough orders"}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Utensils className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders - Only showing active orders */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Active Orders</h2>
                        <p className="text-gray-600 text-sm mt-1">Preparing, placed and out for delivery orders</p>
                      </div>
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        {recentOrders.length} active
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      </div>
                    ) : !recentOrders.length ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                        <p className="text-gray-500">No active orders</p>
                        <p className="text-sm text-gray-400 mt-1">All orders are completed or delivered</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div
                            key={order.order_id}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-lg ${getStatusColor(order.order_status)}`}>
                                {getStatusIcon(order.order_status)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">#{order.order_id}</p>
                                <p className="text-sm text-gray-500">
                                  {order.customer_name || order.name || "Customer"}
                                </p>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.order_status)}`}>
                                  {getStatusIcon(order.order_status)}
                                  <span className="capitalize">{order.order_status}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 flex items-center justify-end">
                                <IndianRupee className="w-4 h-4 mr-1" />
                                {Math.round(order.total_amount || order.total).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatTime(order.order_time || order.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Status & Quick Stats */}
              <div className="space-y-6">
                {/* Order Status Overview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
                  <div className="space-y-4">
                    {Object.entries(orderStatusCounts).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                          </div>
                          <span className="capitalize text-gray-700">{status}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Overview</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Orders Today</span>
                      <span className="font-semibold text-gray-900">
                        {orders.filter(order => {
                          const orderDate = new Date(order.order_time || order.created_at);
                          const today = new Date();
                          return orderDate.toDateString() === today.toDateString();
                        }).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Revenue Today</span>
                      <span className="font-semibold text-gray-900 flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        {Math.round(
                          orders
                            .filter(order => {
                              const orderDate = new Date(order.order_time || order.created_at);
                              const today = new Date();
                              return orderDate.toDateString() === today.toDateString();
                            })
                            .reduce((sum, order) => sum + Number(order.total_amount || 0), 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                   
                  </div>
                </div>

               
              </div>
            </div>
          </main>
        </div>
      </div>
    </OrderModalProvider>
  );
}
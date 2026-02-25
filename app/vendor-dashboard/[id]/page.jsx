"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import { useParams, useRouter } from "next/navigation";
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
  IndianRupee,
  X,
  ChevronRight
} from "lucide-react";
import { BASE_URL } from "@/app/page";

const RESTAURANT_API = BASE_URL+"restaurants/get_restaurants.php";
const MENU_API = BASE_URL+"restaurants/get_menu.php";
const ORDERS_API = BASE_URL+"orders/get_order.php";

export default function DashboardHome() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Handle tie in most ordered dishes - shows ALL tied dishes with scrollable container
  const mostOrderedDishes = useMemo(() => {
    if (!orders.length) return [];
    
    const count = {};
    
    // Count items across all orders
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const itemId = item.menu_id;
        if (itemId) {
          count[itemId] = (count[itemId] || 0) + Number(item.quantity || 1);
        }
      });
    });
    
    // Convert to array and sort by count
    const itemsArray = Object.entries(count)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count);
    
    if (itemsArray.length === 0) return [];
    
    // Find the highest count
    const highestCount = itemsArray[0].count;
    
    // Get all items with the highest count (handle ties)
    const topDishes = itemsArray.filter(item => item.count === highestCount);
    
    // Map to dish names (show ALL tied dishes)
    const dishes = topDishes
      .map(item => {
        const dish = menu.find((m) => m.menu_id == item.id);
        return dish ? { 
          name: dish.item_name, 
          count: item.count,
          price: dish.price || 0,
          id: dish.menu_id
        } : null;
      })
      .filter(Boolean);
    
    return dishes;
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

  // Navigation helper functions
  const navigateToOrders = () => {
    if (id) {
      router.push(`/vendor-dashboard/${id}/orders`);
    }
  };

  const navigateToMenu = () => {
    if (id) {
      router.push(`/vendor-dashboard/${id}/menu`);
    }
  };

  // Modal functions
  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Earnings */}
              <div 
                onClick={navigateToOrders}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group hover:border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2 group-hover:text-green-700">
                      {formatCurrency(totalEarnings)}
                    </p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      All time revenue
                      <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                    <IndianRupee className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Total Orders */}
              <div 
                onClick={navigateToOrders}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group hover:border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2 group-hover:text-blue-700">
                      {orders.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      All time orders
                      <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Active Orders */}
              <div 
                onClick={navigateToOrders}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group hover:border-orange-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2 group-hover:text-orange-700">
                      {activeOrders}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      Need attention
                      <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Most Popular Dishes */}
              <div 
                onClick={navigateToMenu}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group hover:border-purple-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {mostOrderedDishes.length > 1 ? 'Most Popular Dishes' : 'Most Popular'}
                      {mostOrderedDishes.length > 0 && (
                        <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                          {mostOrderedDishes.length} tied
                        </span>
                      )}
                    </p>
                    
                    {/* Scrollable container for tied dishes */}
                    <div className="max-h-24 overflow-y-auto pr-2">
                      {mostOrderedDishes.length === 0 ? (
                        <p className="text-lg font-bold text-gray-900">No data</p>
                      ) : (
                        <div className="space-y-2">
                          {mostOrderedDishes.map((dish, index) => (
                            <div key={dish.id || index} className="flex items-center justify-between group/item">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[60%] group-hover/item:text-purple-700">
                                  {dish.name}
                                </span>
                              </div>
                              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                                {dish.count} orders
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {mostOrderedDishes.length > 0 && (
                      <p className="text-xs text-gray-400 mt-2 flex items-center">
                        {mostOrderedDishes.length === 1 
                          ? "Top dish by orders" 
                          : `${mostOrderedDishes.length} dishes with ${mostOrderedDishes[0]?.count} orders each`}
                        <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors ml-3">
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
                      <div className="flex items-center space-x-2">
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                          {recentOrders.length} active
                        </span>
                        <button
                          onClick={navigateToOrders}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                        >
                          View all
                        </button>
                      </div>
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
                            onClick={() => openOrderModal(order)}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 cursor-pointer group hover:border-blue-200"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-lg ${getStatusColor(order.order_status)} group-hover:scale-105 transition-transform`}>
                                {getStatusIcon(order.order_status)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 group-hover:text-blue-600">
                                  #{order.order_id}
                                </p>
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
                              <p className="font-semibold text-gray-900 flex items-center justify-end group-hover:text-blue-600">
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
                {/* Order Status Overview - Each status is clickable */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                    <button
                      onClick={navigateToOrders}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(orderStatusCounts).map(([status, count]) => (
                      <div 
                        key={status} 
                        onClick={navigateToOrders}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                          </div>
                          <span className="capitalize text-gray-700 group-hover:text-blue-600">{status}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600">{count}</span>
                          <ChevronRight className="w-4 h-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Overview</h2>
                  <div className="space-y-4">
                    <div 
                      onClick={navigateToOrders}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                    >
                      <span className="text-gray-600">Orders Today</span>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {orders.filter(order => {
                            const orderDate = new Date(order.order_time || order.created_at);
                            const today = new Date();
                            return orderDate.toDateString() === today.toDateString();
                          }).length}
                        </span>
                        <ChevronRight className="w-4 h-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                    <div 
                      onClick={navigateToOrders}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                    >
                      <span className="text-gray-600">Revenue Today</span>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 group-hover:text-blue-600 flex items-center">
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
                        <ChevronRight className="w-4 h-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity cursor-pointer"
              onClick={closeOrderModal}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div 
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order #{selectedOrder.order_id ?? selectedOrder.id}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {formatDate(selectedOrder.created_at ?? selectedOrder.created)}
                    </p>
                  </div>
                  <button
                    onClick={closeOrderModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Customer Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Name</label>
                          <p className="text-gray-900">{selectedOrder.customer_name ?? selectedOrder.name ?? "—"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Phone</label>
                          <p className="text-gray-900">{selectedOrder.customer_phone ?? selectedOrder.phone ?? "—"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Email</label>
                          <p className="text-gray-900">{selectedOrder.customer_email ?? selectedOrder.email ?? "—"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Address</label>
                          <p className="text-gray-900">{selectedOrder.delivery_address ?? selectedOrder.address ?? "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Status</span>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.order_status)}`}>
                            {getStatusIcon(selectedOrder.order_status)}
                            <span className="capitalize">{selectedOrder.order_status ?? selectedOrder.status ?? "—"}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount</span>
                          <span className="font-semibold text-gray-900 flex items-center">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {Math.round(selectedOrder.total_amount || selectedOrder.total).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="text-gray-900">{selectedOrder.payment_method ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status</span>
                          <span className="text-gray-900">{selectedOrder.payment_status ?? "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Item</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {(selectedOrder.items ?? []).map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.item_name ?? item.name}
                                  </div>
                                  {item.variations && (
                                    <div className="text-sm text-gray-500 mt-1">
                                      {item.variations}
                                    </div>
                                  )}
                                  {item.special_instructions && (
                                    <div className="text-sm text-gray-500 mt-1">
                                      Note: {item.special_instructions}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {item.quantity ?? item.qty ?? 1}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 flex items-center">
                                  <IndianRupee className="w-3 h-3 mr-1" />
                                  {Math.round(item.price ?? item.rate).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 flex items-center">
                                  <IndianRupee className="w-3 h-3 mr-1" />
                                  {Math.round((item.price ?? item.rate) * (item.quantity ?? item.qty ?? 1)).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {(selectedOrder.notes || selectedOrder.special_instructions) && (
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Instructions</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">
                            {selectedOrder.notes ?? selectedOrder.special_instructions}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={closeOrderModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </OrderModalProvider>
  );
}
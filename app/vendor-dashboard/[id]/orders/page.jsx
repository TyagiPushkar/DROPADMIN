"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { Search, Filter, RefreshCw, Clock, CheckCircle, XCircle, Truck, AlertCircle, X, MoreVertical, ChefHat, MapPin, Home, Package, UserCheck, Bike, Store } from "lucide-react"
import Sidebar from "../components/sidebar"
import Navbar from "../components/navbar"
import { OrderModalProvider } from "../components/orderModalProvider"
import { BASE_URL } from "@/app/page"

export default function OrdersPage() {
  const [user, setUser] = useState(null)
  const [restaurantId, setRestaurantId] = useState(null)
  const [matchedRestaurant, setMatchedRestaurant] = useState(null)
  const [restaurantsRaw, setRestaurantsRaw] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const RESTAURANT_API = BASE_URL+"restaurants/get_restaurants.php"
  const ORDERS_API_BASE = BASE_URL+"orders/get_order.php"

  useEffect(() => {
   
    const data = Cookies.get("user")
    
    if (data) {
      try {
        const parsed = JSON.parse(data)
        
        setUser(parsed)
      } catch (e) {
        
        setError("Failed to parse user cookie")
      }
    } else {
      console.warn("[Orders] No 'user' cookie found")
    }
  }, [])

  useEffect(() => {
    if (!user?.Email) {
      if (user) console.warn("[Orders] user exists but no Email field:", user)
      return
    }

    async function findRestaurant() {
      console.debug("[Orders] Fetching restaurants from:", RESTAURANT_API)
      setError(null)
      try {
        const response = await fetch(RESTAURANT_API, { cache: "no-store" })
        const data = await response.json()
        setRestaurantsRaw(data)

        const list = Array.isArray(data.restaurants)
          ? data.restaurants
          : Array.isArray(data.data)
          ? data.data
          : null

        if (!list) {
          console.error("[Orders] Restaurants API did not return an array under 'restaurants' or 'data'")
          setError("Restaurants API returned unexpected shape (see console)")
          return
        }

        console.debug(
          `[Orders] Looking for restaurants where email matches user email "${user.Email}"`
        )

        const possibleEmailFields = ["owner_email", "email", "restaurant_email", "contact_email"]

        let found = null
        for (const r of list) {
          const candidates = possibleEmailFields
            .map((f) => (r[f] ? String(r[f]).toLowerCase() : null))
            .filter(Boolean)

          for (const key of Object.keys(r)) {
            const val = r[key]
            if (typeof val === "string" && val.includes("@")) {
              candidates.push(val.toLowerCase())
            }
          }

          console.debug(
            `[Orders] checking restaurant id=${r.restaurant_id ?? r.id ?? "(no id)"} - candidate emails:`,
            candidates
          )

          if (candidates.includes(user.Email.toLowerCase())) {
            found = r
            console.info(
              `[Orders] MATCHED restaurant (id=${r.restaurant_id ?? r.id}) for user email ${user.Email}`
            )
            break
          }
        }

        if (found) {
          const rid = found.restaurant_id ?? found.id ?? found.restaurantId ?? null
          setMatchedRestaurant(found)
          setRestaurantId(rid)
          console.debug("[Orders] extracted restaurant id:", rid)
        } else {
          console.warn("[Orders] No restaurant matched user email:", user.Email)
          setError("No restaurant matched your account email.")
        }
      } catch (err) {
        console.error("[Orders] Error fetching restaurants:", err)
        setError("Failed to fetch restaurants (see console)")
      }
    }

    findRestaurant()
  }, [user])

  useEffect(() => {
    if (!restaurantId) return
    loadOrders()
  }, [restaurantId])

  const loadOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ role: "admin", restaurant_id: String(restaurantId) })
      const url = `${ORDERS_API_BASE}?${params.toString()}`
      

      const response = await fetch(url, { cache: "no-store" })
      const data = await response.json()
      

      const ordersList = data.orders ?? data.data ?? data.result ?? []
      console.debug("[Orders] normalized orders list length:", Array.isArray(ordersList) ? ordersList.length : "not-array")

      if (Array.isArray(ordersList)) {
        setOrders(ordersList)
      } else {
        console.warn("[Orders] orders response did not contain an array; storing raw response")
        setOrders([])
        setError("Orders API returned unexpected shape. See console.log.")
      }
    } catch (err) {
      console.error("[Orders] Error fetching orders:", err)
      setError("Failed to fetch orders (see console)")
      setOrders([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadOrders()
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const openOrderModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeOrderModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  // Enhanced search functionality
  const searchOrders = (orders, searchTerm) => {
    if (!searchTerm.trim()) return orders

    const searchLower = searchTerm.toLowerCase().trim()
    
    return orders.filter(order => {
      // Search in order ID
      const orderId = String(order.order_id ?? order.id ?? "").toLowerCase()
      if (orderId.includes(searchLower)) return true

      // Search in customer name
      const customerName = String(order.customer_name ?? order.name ?? "").toLowerCase()
      if (customerName.includes(searchLower)) return true

      // Search in customer phone
      const customerPhone = String(order.customer_phone ?? order.phone ?? "").toLowerCase()
      if (customerPhone.includes(searchLower)) return true

      // Search in customer email
      const customerEmail = String(order.customer_email ?? order.email ?? "").toLowerCase()
      if (customerEmail.includes(searchLower)) return true

      // Search in order status
      const orderStatus = String(order.order_status ?? order.status ?? "").toLowerCase()
      if (orderStatus.includes(searchLower)) return true

      // Search in total amount (convert to string and search)
      const totalAmount = String(order.total_amount ?? order.total ?? "").toLowerCase()
      if (totalAmount.includes(searchLower)) return true

      // Search in order items
      const items = order.items ?? []
      const foundInItems = items.some(item => {
        const itemName = String(item.item_name ?? item.name ?? "").toLowerCase()
        return itemName.includes(searchLower)
      })
      if (foundInItems) return true

      // Search in order notes or special instructions
      const orderNotes = String(order.notes ?? order.special_instructions ?? "").toLowerCase()
      if (orderNotes.includes(searchLower)) return true

      return false
    })
  }

  // Enhanced status icon mapping
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'placed': return Clock
      case 'restaurant_accepted': return Store
      case 'driver_assigned': return UserCheck
      case 'reach_restaurant': return MapPin
      case 'preparing': return ChefHat
      case 'out for delivery': return Bike
      case 'reached_location': return Home
      case 'delivered': return Truck
      case 'cancelled': return XCircle
      default: return AlertCircle
    }
  }

  // Enhanced status color mapping
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'placed': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'restaurant_accepted': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'driver_assigned': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'reach_restaurant': return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      case 'preparing': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'out for delivery': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'reached_location': return 'bg-teal-50 text-teal-700 border-teal-200'
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Get status display name
  const getStatusDisplay = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'placed': return 'Placed'
      case 'restaurant_accepted': return 'Accepted'
      case 'driver_assigned': return 'Driver Assigned'
      case 'reach_restaurant': return 'Reach Restaurant'
      case 'preparing': return 'Preparing'
      case 'out for delivery': return 'Out for Delivery'
      case 'reached_location': return 'Reached Location'
      case 'delivered': return 'Delivered'
      case 'cancelled': return 'Cancelled'
      default: return status || '—'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—"
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount) => {
    if (!amount) return "₹—"
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`
  }

  // Define all possible statuses from your DB
  const allStatuses = [
    "Placed",
    "Restaurant_Accepted",
    "Driver_Assigned",
    "Reach_restaurant",
    "Preparing",
    "Out for Delivery",
    "Reached_Location",
    "Delivered",
    "Cancelled"
  ]

  // Calculate status counts
  const statusCounts = {
    all: orders.length,
    ...allStatuses.reduce((acc, status) => {
      acc[status] = orders.filter(o => 
        o.order_status?.toLowerCase() === status.toLowerCase()
      ).length
      return acc
    }, {})
  }

  // Group counts by status category for better visualization
  const pendingOrders = allStatuses
    .filter(s => !['Delivered', 'Cancelled'].includes(s))
    .reduce((sum, status) => sum + (statusCounts[status] || 0), 0)

  const completedOrders = statusCounts['Delivered'] || 0
  const cancelledOrders = statusCounts['Cancelled'] || 0

  // Apply both search and status filters
  const filteredOrders = searchOrders(orders, searchTerm).filter(order => {
    if (statusFilter === "all") return true
    if (statusFilter === "pending") {
      return !['delivered', 'cancelled'].includes(order.order_status?.toLowerCase())
    }
    if (statusFilter === "completed") {
      return order.order_status?.toLowerCase() === 'delivered'
    }
    if (statusFilter === "cancelled") {
      return order.order_status?.toLowerCase() === 'cancelled'
    }
    return order.order_status?.toLowerCase() === statusFilter.toLowerCase()
  })

  // Status update function
  const handleStatusUpdate = async (newStatus) => {
    try {
      const orderId = selectedOrder.order_id ?? selectedOrder.id;
      
      // Call your API to update the status
      await updateStatus(orderId, newStatus);
      
      // Update the local state to reflect the change
      const updatedOrder = {
        ...selectedOrder,
        order_status: newStatus
      };
      
      // Update the selectedOrder in state
      setSelectedOrder(updatedOrder);
      
      // Update orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          (order.order_id === orderId || order.id === orderId) 
            ? { ...order, order_status: newStatus } 
            : order
        )
      );
      
      console.log(`Order status updated to ${newStatus}`);
      
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  // Your existing API function
  async function updateStatus(order_id, status) {
    const response = await fetch(BASE_URL+"orders/update_order_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id, order_status: status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update status');
    }
    
    return response.json();
  }

  return (
    <OrderModalProvider>
      <div className="flex min-h-screen">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="flex-1 flex-col">
          <Navbar setOpen={setOpen} />

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 mx-6 mt-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Management
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {matchedRestaurant?.restaurant_name ??
                    matchedRestaurant?.name ??
                    "Restaurant"}
                </span>
                <span>ID: {restaurantId ?? "—"}</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {orders.length} total orders
                </span>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Improved Stats Overview - First Row: Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mx-6">
            {/* All Orders Card */}
            <div
              onClick={() => setStatusFilter("all")}
              className={`bg-white rounded-xl p-5 border-2 cursor-pointer transition-all hover:shadow-lg ${
                statusFilter === "all"
                  ? "border-blue-500 shadow-md bg-blue-50/50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.all}</p>
                </div>
                <div className={`p-3 rounded-full ${statusFilter === "all" ? "bg-blue-500" : "bg-gray-100"}`}>
                  <Package className={`w-6 h-6 ${statusFilter === "all" ? "text-white" : "text-gray-600"}`} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">All orders across all statuses</div>
            </div>

            {/* Active Orders Card */}
            <div
              onClick={() => setStatusFilter("pending")}
              className={`bg-white rounded-xl p-5 border-2 cursor-pointer transition-all hover:shadow-lg ${
                statusFilter === "pending"
                  ? "border-orange-500 shadow-md bg-orange-50/50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Orders</p>
                  <p className="text-3xl font-bold text-orange-600">{pendingOrders}</p>
                </div>
                <div className={`p-3 rounded-full ${statusFilter === "pending" ? "bg-orange-500" : "bg-orange-100"}`}>
                  <Clock className={`w-6 h-6 ${statusFilter === "pending" ? "text-white" : "text-orange-600"}`} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Orders in progress</div>
            </div>

            {/* Completed Orders Card */}
            <div
              onClick={() => setStatusFilter("completed")}
              className={`bg-white rounded-xl p-5 border-2 cursor-pointer transition-all hover:shadow-lg ${
                statusFilter === "completed"
                  ? "border-green-500 shadow-md bg-green-50/50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Delivered</p>
                  <p className="text-3xl font-bold text-green-600">{completedOrders}</p>
                </div>
                <div className={`p-3 rounded-full ${statusFilter === "completed" ? "bg-green-500" : "bg-green-100"}`}>
                  <CheckCircle className={`w-6 h-6 ${statusFilter === "completed" ? "text-white" : "text-green-600"}`} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Successfully delivered</div>
            </div>

            {/* Cancelled Orders Card */}
            <div
              onClick={() => setStatusFilter("cancelled")}
              className={`bg-white rounded-xl p-5 border-2 cursor-pointer transition-all hover:shadow-lg ${
                statusFilter === "cancelled"
                  ? "border-red-500 shadow-md bg-red-50/50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Cancelled</p>
                  <p className="text-3xl font-bold text-red-600">{cancelledOrders}</p>
                </div>
                <div className={`p-3 rounded-full ${statusFilter === "cancelled" ? "bg-red-500" : "bg-red-100"}`}>
                  <XCircle className={`w-6 h-6 ${statusFilter === "cancelled" ? "text-white" : "text-red-600"}`} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Orders that were cancelled</div>
            </div>
          </div>

          {/* Second Row: Detailed Status Cards - Horizontal Scrollable */}
          <div className="mb-6 mx-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Order Status Breakdown</h3>
              <span className="text-xs text-gray-500">Scroll for more →</span>
            </div>
            <div className="overflow-x-auto pb-2 -mb-2">
              <div className="flex gap-3 min-w-max">
                {allStatuses.map((status) => {
                  const count = statusCounts[status] || 0
                  const StatusIcon = getStatusIcon(status)
                  const colorClass = getStatusColor(status)
                  const isActive = statusFilter === status
                  
                  return (
                    <div
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-md w-40 ${
                        isActive
                          ? "border-blue-500 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${colorClass.split(' ')[0]}`}>
                          <StatusIcon size={18} className={colorClass.split(' ')[1]} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">{count}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {getStatusDisplay(status)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {count === 1 ? 'order' : 'orders'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 mx-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer name, phone, items, status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Active Orders</option>
                  {allStatuses.map(status => (
                    <option key={status} value={status}>
                      {getStatusDisplay(status)}
                    </option>
                  ))}
                  <option value="completed">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Search Results Info */}
            {(searchTerm || statusFilter !== "all") && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-600">
                  Showing {filteredOrders.length} of {orders.length} orders
                </span>

                {searchTerm && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                    Search: "{searchTerm}"
                    <button
                      onClick={clearSearch}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}

                {statusFilter !== "all" && (
                  <span className={`px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(statusFilter)}`}>
                    Status: {statusFilter === "pending" ? "Active Orders" : 
                            statusFilter === "completed" ? "Delivered" :
                            statusFilter === "cancelled" ? "Cancelled" :
                            getStatusDisplay(statusFilter)}
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="hover:opacity-70"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}

                {(searchTerm || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium ml-auto"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mx-6">
              <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Something went wrong
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center mx-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {orders.length === 0 ? "No orders found" : "No matching orders"}
              </h3>
              <p className="text-gray-600 mb-4">
                {orders.length === 0
                  ? "No orders have been placed yet."
                  : "No orders match your current search and filters."}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear filters and show all orders
                </button>
              )}
            </div>
          )}

          {/* Orders Table */}
          {!loading && filteredOrders.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mx-6 mb-8 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => {
                      const StatusIcon = getStatusIcon(order.order_status);
                      const items = order.items ?? [];
                      const totalItems = items.reduce(
                        (sum, item) => sum + (item.quantity ?? item.qty ?? 1),
                        0,
                      );

                      return (
                        <tr
                          key={order.order_id ?? order.id}
                          onClick={() => openOrderModal(order)}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{order.order_id ?? order.id}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer_name ?? order.name ?? "—"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer_phone ?? order.phone ?? "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {totalItems} items
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {items
                                .slice(0, 2)
                                .map((item) => item.item_name ?? item.name)
                                .join(", ")}
                              {items.length > 2 && ` +${items.length - 2} more`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(
                                order.total_amount ?? order.total,
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}
                            >
                              <StatusIcon size={14} />
                              {getStatusDisplay(order.order_status)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(order.created_at ?? order.created)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Order Details Modal */}
          {isModalOpen && selectedOrder && (
            <>
              {/* Backdrop with blur */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity"
                onClick={closeOrderModal}
              />

              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Order #{selectedOrder.order_id ?? selectedOrder.id}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {formatDate(
                          selectedOrder.created_at ?? selectedOrder.created,
                        )}
                      </p>
                    </div>
                    <button
                      onClick={closeOrderModal}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Customer Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Customer Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Name
                            </label>
                            <p className="text-gray-900">
                              {selectedOrder.customer_name ??
                                selectedOrder.name ??
                                "—"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Phone
                            </label>
                            <p className="text-gray-900">
                              {selectedOrder.customer_phone ??
                                selectedOrder.phone ??
                                "—"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Email
                            </label>
                            <p className="text-gray-900">
                              {selectedOrder.customer_email ??
                                selectedOrder.email ??
                                "—"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Address
                            </label>
                            <p className="text-gray-900">
                              {selectedOrder.delivery_address ??
                                selectedOrder.address ??
                                "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Order Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status</span>
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.order_status)}`}
                            >
                              {getStatusDisplay(selectedOrder.order_status)}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(
                                selectedOrder.total_amount ??
                                  selectedOrder.total,
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Payment Method
                            </span>
                            <span className="text-gray-900">
                              {selectedOrder.payment_method ?? "—"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Payment Status
                            </span>
                            <span className="text-gray-900">
                              {selectedOrder.payment_status ?? "—"}
                            </span>
                          </div>

                          {/* Status Update Section */}
                          <div className="pt-4 border-t border-gray-200">
                            <label className="text-sm font-medium text-gray-600 mb-2 block">
                              Update Order Status
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {allStatuses.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusUpdate(status)}
                                  disabled={
                                    selectedOrder.order_status?.toLowerCase() === status.toLowerCase()
                                  }
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedOrder.order_status?.toLowerCase() === status.toLowerCase()
                                      ? `${getStatusColor(status)} cursor-not-allowed`
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                                  }`}
                                >
                                  {getStatusDisplay(status)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Order Items
                        </h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                  Item
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                  Quantity
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                  Price
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {(selectedOrder.items ?? []).map(
                                (item, index) => (
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
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                      {formatCurrency(item.price ?? item.rate)}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                      {formatCurrency(
                                        (item.price ?? item.rate) *
                                          (item.quantity ?? item.qty ?? 1),
                                      )}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Special Instructions */}
                      {(selectedOrder.notes ||
                        selectedOrder.special_instructions) && (
                        <div className="lg:col-span-2">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Special Instructions
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">
                              {selectedOrder.notes ??
                                selectedOrder.special_instructions}
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
                      className="px-6 py-2 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>{" "}
    </OrderModalProvider>
  );
}
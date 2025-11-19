"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { Search, Filter, RefreshCw, Clock, CheckCircle, XCircle, Truck, AlertCircle, X } from "lucide-react"
import Sidebar from "../components/sidebar"
import Navbar from "../components/navbar"

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

  const RESTAURANT_API = "http://localhost:8000/src/restaurants/get_restaurants.php"
  const ORDERS_API_BASE = "http://localhost:8000/src/orders/get_order.php"

  useEffect(() => {
    console.debug("[Orders] reading cookie 'user'...")
    const data = Cookies.get("user")
    console.debug("[Orders] raw cookie value:", data)
    if (data) {
      try {
        const parsed = JSON.parse(data)
        console.debug("[Orders] parsed cookie:", parsed)
        setUser(parsed)
      } catch (e) {
        console.error("[Orders] Failed to parse cookie 'user':", e)
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
      console.debug("[Orders] orders fetch url:", url)

      const response = await fetch(url, { cache: "no-store" })
      const data = await response.json()
      console.debug("[Orders] orders API response:", data)

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

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'pending': return Clock
      case 'confirmed': return CheckCircle
      case 'preparing': return Clock
      case 'ready': return CheckCircle
      case 'completed': return CheckCircle
      case 'cancelled': return XCircle
      case 'delivered': return Truck
      default: return AlertCircle
    }
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'preparing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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

  // Apply both search and status filters
  const filteredOrders = searchOrders(orders, searchTerm).filter(order => {
    const matchesStatus = statusFilter === "all" || 
      (order.order_status?.toLowerCase() === statusFilter.toLowerCase())
    return matchesStatus
  })

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.order_status?.toLowerCase() === 'pending').length,
    preparing: orders.filter(o => o.order_status?.toLowerCase() === 'preparing').length,
    ready: orders.filter(o => o.order_status?.toLowerCase() === 'ready').length,
    completed: orders.filter(o => o.order_status?.toLowerCase() === 'completed').length,
  }

  // Get search result highlights
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm.trim() || !text) return text
    
    const searchLower = searchTerm.toLowerCase()
    const textStr = String(text)
    const textLower = textStr.toLowerCase()
    
    if (!textLower.includes(searchLower)) return textStr

    const parts = textStr.split(new RegExp(`(${searchTerm})`, 'gi'))
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === searchLower ? (
            <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex-col">
      <Navbar setOpen={setOpen} />
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 mx-8 mt-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {matchedRestaurant?.restaurant_name ?? matchedRestaurant?.name ?? "Restaurant"}
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
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 mx-8">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`bg-white p-4 rounded-xl border-2 cursor-pointer transition-all ${
              statusFilter === status 
                ? 'border-blue-500 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className="text-sm font-medium text-gray-600 capitalize">
              {status === 'all' ? 'All Orders' : status}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 mx-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Search Results Info */}
        {(searchTerm || statusFilter !== "all") && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-600">Showing {filteredOrders.length} of {orders.length} orders</span>
            
            {searchTerm && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                Search: "{searchTerm}"
                <button onClick={clearSearch} className="hover:text-blue-900">
                  <X size={14} />
                </button>
              </span>
            )}
            
            {statusFilter !== "all" && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                Status: {statusFilter}
                <button 
                  onClick={() => setStatusFilter("all")} 
                  className="hover:text-gray-900"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
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
                setSearchTerm("")
                setStatusFilter("all")
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear filters and show all orders
            </button>
          )}
        </div>
      )}

      {/* Orders Grid */}
      {!loading && filteredOrders.length > 0 && (
        <div className="grid gap-4 mx-8">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.order_status)
            const items = order.items ?? []
            const totalItems = items.reduce((sum, item) => sum + (item.quantity ?? item.qty ?? 1), 0)

            return (
              <div key={order.order_id ?? order.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getStatusColor(order.order_status)}`}>
                        <StatusIcon size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order {highlightMatch(`#${order.order_id ?? order.id}`, searchTerm)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.created_at ?? order.created)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(order.total_amount ?? order.total)}
                      </div>
                      <div className="text-sm text-gray-600">{totalItems} items</div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Customer Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-right">
                            {highlightMatch(order.customer_name ?? order.name ?? "—", searchTerm)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">
                            {highlightMatch(order.customer_phone ?? order.phone ?? "—", searchTerm)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                            {highlightMatch(order.order_status ?? order.status ?? "—", searchTerm)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">
                                {highlightMatch(item.item_name ?? item.name, searchTerm)}
                              </span>
                              <span className="text-gray-500 ml-2">
                                × {item.quantity ?? item.qty ?? 1}
                              </span>
                            </div>
                            <div className="font-medium text-gray-900">
                              {formatCurrency(item.price ?? item.rate)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Update Status
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Contact Customer
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div> </div>
  )
}
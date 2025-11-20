"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import Sidebar from "../components/sidebar"
import Navbar from "../components/navbar"

export default function MenuPage() {
  const [user, setUser] = useState(null)
  const [restaurantId, setRestaurantId] = useState(null)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({
  item_name: "",
  description: "",
  price: "",
  category: "",
  is_veg: "1",
  is_available: "1",
})
  const [portions, setPortions] = useState([
  { portion_type: "unit", portion_price: "" },
])


  const RESTAURANT_API = "https://namami-infotech.com/DROP/src/restaurants/get_restaurants.php"
  const MENU_API = "https://namami-infotech.com/DROP/src/restaurants/get_menu.php"

  useEffect(() => {
    const data = Cookies.get("user")
    if (data) {
      try {
        const parsed = JSON.parse(data)
        setUser(parsed)
        setDebugInfo(prev => prev + `✅ User loaded: ${parsed.Email}\n`)
      } catch (e) {
        console.log("❌ Cookie parse error:", e)
        setDebugInfo(prev => prev + `❌ Cookie parse error: ${e}\n`)
      }
    } else {
      setDebugInfo(prev => prev + "❌ No user cookie found\n")
    }
  }, [])

  useEffect(() => {
    if (!user?.Email) {
      setDebugInfo(prev => prev + "❌ User email missing\n")
      return
    }

    const userEmail = user.Email.trim().toLowerCase()
    setDebugInfo(prev => prev + `🔍 Searching for restaurant with email: ${userEmail}\n`)

    async function findRestaurant() {
      try {
        setDebugInfo(prev => prev + "📡 Fetching restaurants...\n")
        const response = await fetch(RESTAURANT_API)
        const data = await response.json()

        setDebugInfo(prev => prev + `📊 API Response: ${JSON.stringify(data).substring(0, 200)}...\n`)

        if (!data.success) {
          setDebugInfo(prev => prev + `❌ API not successful: ${data.message}\n`)
          return
        }

        const restaurants = data.restaurants || data.data || []
        setDebugInfo(prev => prev + `🏪 Found ${restaurants.length} restaurants\n`)

        if (restaurants.length === 0) {
          setDebugInfo(prev => prev + "❌ No restaurants found in response\n")
          return
        }

        // 🔍 DEBUG: Log all emails found in restaurants
        restaurants.forEach((restaurant, index) => {
          const possibleEmailFields = ['email', 'owner_email', 'restaurant_email', 'contact_email', 'Email']
          let foundEmail = null
          
          possibleEmailFields.forEach(field => {
            if (restaurant[field]) {
              foundEmail = restaurant[field]
            }
          })

          setDebugInfo(prev => prev + 
            `Restaurant ${index + 1}: ID=${restaurant.restaurant_id || restaurant.id}, ` +
            `Email=${foundEmail || 'NOT FOUND'}\n`
          )
        })

        // 🎯 Try multiple email field names
        const possibleEmailFields = ['email', 'owner_email', 'restaurant_email', 'contact_email', 'Email']
        
        let foundRestaurant = null
        let foundField = null

        for (const restaurant of restaurants) {
          for (const field of possibleEmailFields) {
            const restaurantEmail = restaurant[field]
            if (restaurantEmail && restaurantEmail.trim().toLowerCase() === userEmail) {
              foundRestaurant = restaurant
              foundField = field
              break
            }
          }
          if (foundRestaurant) break
        }

        if (foundRestaurant) {
          const rid = foundRestaurant.restaurant_id || foundRestaurant.id
          setRestaurantId(rid)
          setDebugInfo(prev => prev + 
            `✅ FOUND! Restaurant ID: ${rid} (matched on field: ${foundField})\n`
          )
        } else {
          setDebugInfo(prev => prev + `❌ No restaurant found for email: ${userEmail}\n`)
          setDebugInfo(prev => prev + `💡 Try checking these email fields: ${possibleEmailFields.join(', ')}\n`)
        }

      } catch (err) {
        console.log("❌ Restaurant fetch error:", err)
        setDebugInfo(prev => prev + `❌ Fetch error: ${err.message}\n`)
      }
    }

    findRestaurant()
  }, [user])

  useEffect(() => {
    if (!restaurantId) return

    async function loadMenu() {
      setLoading(true)
      try {
        setDebugInfo(prev => prev + `📦 Fetching menu for restaurant ID: ${restaurantId}\n`)
        const response = await fetch(`${MENU_API}?restaurant_id=${restaurantId}`)
        const data = await response.json()

        setDebugInfo(prev => prev + `🍽️ Menu API Response: ${JSON.stringify(data).substring(0, 300)}...\n`)

        if (data.success) {
          setMenu(data.data || data.menu || [])
          setDebugInfo(prev => prev + `✅ Loaded ${data.data?.length || 0} menu items\n`)
        } else {
          setDebugInfo(prev => prev + `❌ Menu API failed: ${data.message}\n`)
        }
      } catch (err) {
        console.log("❌ Menu fetch error:", err)
        setDebugInfo(prev => prev + `❌ Menu fetch error: ${err.message}\n`)
      }
      setLoading(false)
    }

    loadMenu()
  }, [restaurantId])
  async function handleAddMenuItem() {
    if (!restaurantId) {
      alert("Restaurant not loaded yet.")
      return
    }
  
    const payload = {
      restaurant_id: restaurantId,
      ...newItem,
      portions: portions.filter(p => p.portion_price !== "")
    }
  
    try {
      const response = await fetch(
        "http://localhost:8000/src/restaurants/add_menu.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
  
      const data = await response.json()
  
      if (data.success) {
        alert("Menu item added successfully!")
        setShowAddModal(false)
        setNewItem({
          item_name: "",
          description: "",
          price: "",
          category: "",
          is_veg: "1",
          is_available: "1",
        })
        setPortions([{ portion_type: "unit", portion_price: "" }])
  
        // Reload menu
        const menuRes = await fetch(
          `${MENU_API}?restaurant_id=${restaurantId}`
        )
        const menuData = await menuRes.json()
        setMenu(menuData.data || [])
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert("Error adding item: " + err.message)
    }
  }
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Navbar setOpen={setOpen} />

        <div className="p-6">
          

          <p className="text-gray-600 mb-4">
            Restaurant ID: {restaurantId ?? "Not found"}
          </p>

         
          {showAddModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add New Menu Item</h2>
          <button
            onClick={() => setShowAddModal(false)}
            className="text-white/80 hover:text-white transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
        <p className="text-blue-100 text-sm mt-1">Fill in the details below to add a new item to your menu</p>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-4">
        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Margherita Pizza"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={newItem.item_name}
            onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Describe your menu item..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
        </div>

        {/* Category and Base Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Main Course"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            />
          </div>
        </div>

        {/* Food Type and Availability */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Type
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer"
              value={newItem.is_veg}
              onChange={(e) => setNewItem({ ...newItem, is_veg: e.target.value })}
            >
              <option value="1">🟢 Vegetarian</option>
              <option value="0">🔴 Non-Vegetarian</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer"
              value={newItem.is_available}
              onChange={(e) => setNewItem({ ...newItem, is_available: e.target.value })}
            >
              <option value="1">✅ Available</option>
              <option value="0">❌ Unavailable</option>
            </select>
          </div>
        </div>

        {/* Portions Section */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Portion Sizes & Prices
            </label>
            <button
              type="button"
              className="text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-lg transition-colors font-medium cursor-pointer"
              onClick={() =>
                setPortions([
                  ...portions,
                  { portion_type: "unit", portion_price: "" },
                ])
              }
            >
              + Add Portion
            </button>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {portions.map((p, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                <select
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm cursor-pointer"
                  value={p.portion_type}
                  onChange={(e) => {
                    const updated = [...portions]
                    updated[index].portion_type = e.target.value
                    setPortions(updated)
                  }}
                >
                  <option value="unit">Unit</option>
                  <option value="half">Half</option>
                  <option value="full">Full</option>
                  <option value="piece">Piece</option>
                  <option value="kg">Kilogram</option>
                  <option value="litre">Litre</option>
                  <option value="pack">Pack</option>
                  <option value="family">Family Pack</option>
                </select>

                <input
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  type="number"
                  placeholder="Price"
                  value={p.portion_price}
                  onChange={(e) => {
                    const updated = [...portions]
                    updated[index].portion_price = e.target.value
                    setPortions(updated)
                  }}
                />

                <button
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 mr-0 rounded transition-colors  cursor-pointer flex items-center justify-center w-8 h-8"
                  onClick={() => {
                    setPortions(portions.filter((_, i) => i !== index))
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {portions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed">
              No portions added yet
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
        <button
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer"
          onClick={() => setShowAddModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-200 cursor-pointer"
          onClick={handleAddMenuItem}
        >
          Add Menu Item
        </button>
      </div>
    </div>
  </div>
)}

          <button
  onClick={() => setShowAddModal(true)}
  className="mb-4 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
>
  + Add Menu Item
</button>

          {loading ? (
            <p>Loading menu...</p>
          ) : menu.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">No menu items found.</p>
              
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Available?</th>
                    <th className="p-3 text-left">Portions</th>
                  </tr>
                </thead>

                <tbody>
                  {menu.map((item) => (
                    <tr key={item.menu_id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <p className="font-semibold">{item.item_name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3 font-semibold">₹{item.price}</td>
                      <td className="p-3">
                        {item.is_veg ? (
                          <span className="text-green-600 font-bold">Veg</span>
                        ) : (
                          <span className="text-red-600 font-bold">Non-Veg</span>
                        )}
                      </td>
                      <td className="p-3">
                        {item.is_available ? (
                          <span className="text-green-600 font-semibold">Available</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Unavailable</span>
                        )}
                      </td>
                      <td className="p-3">
                        {item.portions?.length === 0 ? (
                          <span className="text-gray-500">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                          {item.portions.map((p) => (
                            <span
                              key={p.portion_id}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium shadow-sm"
                            >
                              {p.portion_type}: ₹{p.portion_price}
                            </span>
                          ))}
                        </div>
                        
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
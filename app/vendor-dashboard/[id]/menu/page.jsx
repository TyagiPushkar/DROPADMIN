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

  const RESTAURANT_API = "http://localhost:8000/src/restaurants/get_restaurants.php"
  const MENU_API = "http://localhost:8000/src/restaurants/get_menu.php"

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Navbar setOpen={setOpen} />

        <div className="p-6">
          

          <p className="text-gray-600 mb-4">
            Restaurant ID: {restaurantId ?? "Not found"}
          </p>

          {/* Debug Info */}


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
                          item.portions.map((p) => (
                            <div key={p.portion_id} className="text-sm">
                              {p.portion_type} — ₹{p.portion_price}
                            </div>
                          ))
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
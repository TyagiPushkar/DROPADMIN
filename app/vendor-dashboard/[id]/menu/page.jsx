"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import Sidebar from "../components/sidebar"
import Navbar from "../components/navbar"
import { OrderModalProvider } from "../components/orderModalProvider"
import { BASE_URL } from "@/app/page"

export default function MenuPage() {
  const [user, setUser] = useState(null)
  const [restaurantId, setRestaurantId] = useState(null)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  
  const [newItem, setNewItem] = useState({
    item_name: "",
    description: "",
    category: "",
    is_veg: "1",
    is_available: "1",
    portion_type: "",
    image: null,
  })
  
  const [portions, setPortions] = useState([
    { label: "", value: "", price: "" },
  ])
  
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Predefined categories for dropdown
  const categories = [
    "Appetizers",
    "Main Course",
    "Rice Dishes",
    "Breads",
    "Curries",
    "Tandoori",
    "Seafood",
    "Chinese",
    "Italian",
    "Burgers & Sandwiches",
    "Pizza",
    "Salads",
    "Desserts",
    "Beverages",
    "Breakfast",
    "Combo Meals",
    "Specials",
    "Kids Menu"
  ]

  const RESTAURANT_API = BASE_URL+"restaurants/get_restaurants.php"
  const MENU_API = BASE_URL+"restaurants/get_menu.php"

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

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WEBP, GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setNewItem({ ...newItem, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle removing image
  const handleRemoveImage = () => {
    setNewItem({ ...newItem, image: null });
    setImagePreview(null);
  };

  async function handleAddMenuItem() {
    if (!restaurantId) {
      alert("Restaurant not loaded yet.");
      return;
    }
  
    if (!newItem.item_name.trim()) {
      alert("Item name is required");
      return;
    }
  
    if (!newItem.category) {
      alert("Category is required");
      return;
    }
  
    if (!newItem.portion_type) {
      alert("Unit type is required");
      return;
    }
  
   const validPortions = portions.filter(p =>
  p.label.trim() &&
  p.value !== "" &&
  !isNaN(p.value) &&
  p.price !== "" &&
  !isNaN(p.price)
);

  
   const formattedPortions = validPortions.map(p => ({
  label: p.label.trim(),
  value: Number(p.value),   // safer than parseFloat
  unit: newItem.portion_type,
  price: Number(p.price)
}));

  
    // 🔑 Build menu_data exactly as backend expects
   const menuData = {
  // menu_id: editingItem.menu_id,
  restaurant_id: restaurantId,
  item_name: newItem.item_name.trim(),
  description: newItem.description?.trim() || null,
  category: newItem.category,
  is_veg: Number(newItem.is_veg),
  is_available: Number(newItem.is_available),
  portion_type: newItem.portion_type,
  portions: formattedPortions,
  price: formattedPortions[0].price   
};

  
    const formData = new FormData();
    formData.append("menu_data", JSON.stringify(menuData));
  
    if (newItem.image) {
      formData.append("image", newItem.image);
    }
  
    try {
      setUploadingImage(true);
  
      const response = await fetch(
        BASE_URL + "restaurants/add_menu.php",
        {
          method: "POST",
          body: formData
        }
      );
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error(data.message || "Failed to add menu item");
      }
  
      alert("Menu item added successfully!");
      setShowAddModal(false);
  
      // Reset form
      setNewItem({
        item_name: "",
        description: "",
        category: "",
        is_veg: "1",
        is_available: "1",
        portion_type: "",
        image: null
      });
  
      setPortions([{ label: "", value: "", price: "" }]);
      setImagePreview(null);
  
      // Reload menu
      const menuRes = await fetch(`${MENU_API}?restaurant_id=${restaurantId}`);
      const menuDataRes = await menuRes.json();
      setMenu(menuDataRes.data || []);
  
    } catch (err) {
      console.error("Error adding item:", err);
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  }
  
  // Function to open edit modal
  const handleEditClick = (item) => {
    setEditingItem(item)
    
    // Set the form fields from the item
    setNewItem({
      item_name: item.item_name || "",
      description: item.description || "",
      category: item.category || "",
      is_veg: String(item.is_veg) || "1",
      is_available: String(item.is_available) || "1",
      portion_type: item.portion_type || "",
      image: null,
    })
    
    // Set image preview if item has image
    if (item.image_url) {
      setImagePreview(item.image_url);
    } else {
      setImagePreview(null);
    }
    
    // Set portions from the item
    if (item.portions && item.portions.length > 0) {
      const formattedPortions = item.portions.map(p => ({
        label: p.label || "",
        value: p.value ? String(p.value) : "",
        price: p.price ? String(p.price) : "",
        portion_id: p.portion_id ?? null


      }))
      setPortions(formattedPortions)
    } else {
      setPortions([{ label: "", value: "", price: "" }])
    }
    
    setShowEditModal(true)
  }

  // Function to save edited menu item
  async function handleSaveEdit() {
    if (!restaurantId || !editingItem) {
      alert("Restaurant or item not loaded yet.");
      return;
    }
  
    const validPortions = portions.filter(
      p => p.label.trim() && p.value !== "" && p.price !== ""
    );
  
    if (validPortions.length === 0) {
      alert("At least one portion is required");
      return;
    }
  
    const formattedPortions = validPortions.map(p => ({
      label: p.label.trim(),
      value: Number(p.value),
      unit: newItem.portion_type,
      price: Number(p.price),
      portion_id: p.portion_id ?? null
    }));
  
    const menuData = {
      menu_id: editingItem.menu_id,       
      restaurant_id: restaurantId,
      item_name: newItem.item_name.trim(),
      description: newItem.description?.trim() || null,
      category: newItem.category,
      is_veg: Number(newItem.is_veg),
      is_available: Number(newItem.is_available),
      portion_type: newItem.portion_type,
      portions: formattedPortions,
      price: formattedPortions[0].price
    };
  
   
  
    const formData = new FormData();
    formData.append("menu_data", JSON.stringify(menuData));
  
    if (newItem.image) {
      formData.append("image", newItem.image);
    }
  
    const response = await fetch(
      BASE_URL + "restaurants/update_menu.php",
      { method: "POST", body: formData }
    );
  
    const data = await response.json();
  
    if (!data.success) {
      alert(data.message || "Update failed");
      return;
    }
  
    alert("Menu updated successfully!");
    setShowEditModal(false);
  
    const menuRes = await fetch(`${MENU_API}?restaurant_id=${restaurantId}`);
    const menuDataRes = await menuRes.json();
    setMenu(menuDataRes.data || []);
  }
  
  

  return (
    <OrderModalProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar open={open} onClose={() => setOpen(false)} />

        <div className="flex-1 flex flex-col">
          <Navbar setOpen={setOpen} />

          <div className="p-6">
            {/* Header Section */}
           
            {/* Header Section with Add Button inline */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Menu Management</h1>
                  <p className="text-gray-600 mb-1">
                    Restaurant ID: <span className="font-semibold text-indigo-600">{restaurantId ?? "Not found"}</span>
                  </p>
                  <p className="text-sm text-gray-500">Manage your restaurant menu items, prices, and availability</p>
                </div>
                
               
                <button
                  onClick={() => setShowAddModal(true)}
                  className="cursor-pointer px-5 py-3 mt-auto bg-blue-600 text-white rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold flex items-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add New Menu Item
                </button>
              </div>
            </div>

           
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="bg-blue-600 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-white">Add New Menu Item</h2>
                      <button
                        onClick={() => setShowAddModal(false)}
                        className="text-white/80 hover:text-white transition-colors text-lg cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-indigo-100 text-sm mt-1">Fill in the details below to add a new item to your menu</p>
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
                        placeholder="e.g., Paneer Butter Masala"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Image
                      </label>
                      <div className="space-y-3">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-lg"
                            >
                              ✕
                            </button>
                            <p className="text-xs text-gray-500 mt-2">Click remove to change image</p>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors bg-gray-50">
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <div className="flex flex-col items-center">
                                <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 002 2z"></path>
                                </svg>
                                <p className="text-gray-600 font-medium">Click to upload image</p>
                                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP, GIF (max 5MB)</p>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white cursor-pointer"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Food Type - Veg, Non-Veg, Egg */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Food Type
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white cursor-pointer"
                        value={newItem.is_veg}
                        onChange={(e) => setNewItem({ ...newItem, is_veg: e.target.value })}
                      >
                        <option value="1">🟢 Vegetarian</option>
                        <option value="0">🔴 Non-Vegetarian</option>
                        <option value="2">🥚 Egg</option>
                      </select>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white cursor-pointer"
                        value={newItem.is_available}
                        onChange={(e) => setNewItem({ ...newItem, is_available: e.target.value })}
                      >
                        <option value="1">✅ Available</option>
                        <option value="0">❌ Unavailable</option>
                      </select>
                    </div>

                    {/* Unit Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white cursor-pointer"
                        value={newItem.portion_type || ""}
                        onChange={(e) => setNewItem({ ...newItem, portion_type: e.target.value })}
                      >
                        <option value="">Select unit type</option>
                        <option value="plate">Plate</option>
  <option value="unit">Unit</option>
  <option value="weight">Weight</option>
  <option value="volume">Volume</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">This unit will apply to all portion sizes below</p>
                    </div>

                    {/* Portions Section */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Portion Sizes & Prices <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          className="text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-1"
                          onClick={() =>
                            setPortions([
                              ...portions,
                              { label: "", value: "", price: "" },
                            ])
                          }
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          Add Portion
                        </button>
                      </div>

                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {portions.map((p, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 space-y-3 shadow-sm">
                            {/* Portion Label */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Portion Label (e.g., Half, Full, Small, Large)
                              </label>
                              <input
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                                type="text"
                                placeholder="e.g., Half Plate"
                                value={p.label}
                                onChange={(e) => {
                                  const updated = [...portions]
                                  updated[index].label = e.target.value
                                  setPortions(updated)
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {/* Portion Value */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Value (e.g., 0.5, 1, 250)
                                </label>
                                <input
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                                  type="number"
                                  step="0.01"
                                  placeholder="e.g., 0.5"
                                  value={p.value}
                                  onChange={(e) => {
                                    const updated = [...portions]
                                    updated[index].value = e.target.value
                                    setPortions(updated)
                                  }}
                                />
                              </div>

                              {/* Portion Price */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Price (₹)
                                </label>
                                <input
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                                  type="number"
                                  placeholder="e.g., 180"
                                  value={p.price}
                                  onChange={(e) => {
                                    const updated = [...portions]
                                    updated[index].price = e.target.value
                                    setPortions(updated)
                                  }}
                                />
                              </div>
                            </div>

                            {/* Delete Button */}
                            <div className="flex justify-end pt-2">
                              <button
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium cursor-pointer flex items-center gap-1 border border-red-200"
                                onClick={() => {
                                  setPortions(portions.filter((_, i) => i !== index))
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Remove Portion
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {portions.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed">
                          No portions added yet. Add at least one portion.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                    <button
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium cursor-pointer"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddMenuItem}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : "Add Menu Item"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-white">Edit Menu Item</h2>
                      <button
                        onClick={() => {
                          setShowEditModal(false)
                          setEditingItem(null)
                        }}
                        className="text-white/80 hover:text-white transition-colors text-lg cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-emerald-100 text-sm mt-1">Edit the details of your menu item</p>
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
                        placeholder="e.g., Paneer Butter Masala"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Image
                      </label>
                      <div className="space-y-3">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-lg"
                            >
                              ✕
                            </button>
                            <p className="text-xs text-gray-500 mt-2">Click remove to change image</p>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors bg-gray-50">
                            <input
                              type="file"
                              id="edit-image-upload"
                              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                            <label htmlFor="edit-image-upload" className="cursor-pointer">
                              <div className="flex flex-col items-center">
                                <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="text-gray-600 font-medium">Click to upload new image</p>
                                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP, GIF (max 5MB)</p>
                                {editingItem?.image_url && (
                                  <p className="text-xs text-emerald-600 mt-1">Current image will be replaced</p>
                                )}
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white cursor-pointer"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Food Type - Veg, Non-Veg, Egg */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Food Type
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white cursor-pointer"
                        value={newItem.is_veg}
                        onChange={(e) => setNewItem({ ...newItem, is_veg: e.target.value })}
                      >
                        <option value="1">🟢 Vegetarian</option>
                        <option value="0">🔴 Non-Vegetarian</option>
                        <option value="2">🥚 Egg</option>
                      </select>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white cursor-pointer"
                        value={newItem.is_available}
                        onChange={(e) => setNewItem({ ...newItem, is_available: e.target.value })}
                      >
                        <option value="1">✅ Available</option>
                        <option value="0">❌ Unavailable</option>
                      </select>
                    </div>

                    {/* Unit Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white cursor-pointer"
                        value={newItem.portion_type || ""}
                        onChange={(e) => setNewItem({ ...newItem, portion_type: e.target.value })}
                      >
                        <option value="">Select unit type</option>
                        <option value="plate">Plate</option>
                        <option value="weight">Weight</option>
                        <option value="volume">Volume</option>
                        <option value="unit">Unit</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">This unit will apply to all portion sizes below</p>
                    </div>

                    {/* Portions Section */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Portion Sizes & Prices <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          className="text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-1"
                          onClick={() =>
                            setPortions([
                              ...portions,
                              { label: "", value: "", price: "" },
                            ])
                          }
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          Add Portion
                        </button>
                      </div>

                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {portions.map((p, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 space-y-3 shadow-sm">
                            {/* Portion Label */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Portion Label (e.g., Half, Full, Small, Large)
                              </label>
                              <input
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"
                                type="text"
                                placeholder="e.g., Half Plate"
                                value={p.label}
                                onChange={(e) => {
                                  const updated = [...portions]
                                  updated[index].label = e.target.value
                                  setPortions(updated)
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {/* Portion Value */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Value (e.g., 0.5, 1, 250)
                                </label>
                                <input
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"
                                  type="number"
                                  step="0.01"
                                  placeholder="e.g., 0.5"
                                  value={p.value}
                                  onChange={(e) => {
                                    const updated = [...portions]
                                    updated[index].value = e.target.value
                                    setPortions(updated)
                                  }}
                                />
                              </div>

                              {/* Portion Price */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Price (₹)
                                </label>
                                <input
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"
                                  type="number"
                                  placeholder="e.g., 180"
                                  value={p.price}
                                  onChange={(e) => {
                                    const updated = [...portions]
                                    updated[index].price = e.target.value
                                    setPortions(updated)
                                  }}
                                />
                              </div>
                            </div>

                            {/* Delete Button */}
                            <div className="flex justify-end pt-2">
                              <button
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium cursor-pointer flex items-center gap-1 border border-red-200"
                                onClick={() => {
                                  setPortions(portions.filter((_, i) => i !== index))
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Remove Portion
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {portions.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed">
                          No portions added yet. Add at least one portion.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                    <button
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium cursor-pointer"
                      onClick={() => {
                        setShowEditModal(false)
                        setEditingItem(null)
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium shadow-lg shadow-emerald-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSaveEdit}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Table */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading menu...</p>
              </div>
            ) : menu.length === 0 ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <p className="text-indigo-800 text-lg font-medium mb-2">No menu items found</p>
                <p className="text-indigo-600">Start by adding your first menu item using the button above</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-4 text-left font-semibold">Image</th>
                        <th className="p-4 text-left font-semibold">Item Details</th>
                        <th className="p-4 text-left font-semibold">Category</th>
                        <th className="p-4 text-left font-semibold">Price</th>
                        <th className="p-4 text-left font-semibold">Type</th>
                        <th className="p-4 text-left font-semibold">Status</th>
                        <th className="p-4 text-left font-semibold">Portions</th>
                        <th className="p-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {menu.map((item) => {
                       
                        let minPrice = "—";
                        if (item.portions && item.portions.length > 0) {
                          const prices = item.portions
                            .filter(p => p.price !== null && p.price !== undefined)
                            .map(p => parseFloat(p.price));
                          
                          if (prices.length > 0) {
                            minPrice = `₹${Math.min(...prices)}`;
                          }
                        } else if (item.price) {
                          minPrice = `₹${item.price}`;
                        }

                        // Determine food type
                        const isVeg = item.is_veg;
                        let foodTypeDisplay;
                        let foodTypeClass;
                        
                        if (isVeg === "1" || isVeg === 1 || isVeg === true) {
                          foodTypeDisplay = "Veg";
                          foodTypeClass = "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200";
                        } else if (isVeg === "0" || isVeg === 0 || isVeg === false) {
                          foodTypeDisplay = "Non-Veg";
                          foodTypeClass = "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200";
                        } else if (isVeg === "2" || isVeg === 2) {
                          foodTypeDisplay = "Egg";
                          foodTypeClass = "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200";
                        } else {
                          foodTypeDisplay = "Unknown";
                          foodTypeClass = "bg-gray-50 text-gray-700 border border-gray-200";
                        }

                        // Determine availability
                        const isAvailable = item.is_available;
                        let availabilityDisplay;
                        let availabilityClass;
                        
                        if (isAvailable === "1" || isAvailable === 1 || isAvailable === true) {
                          availabilityDisplay = "Available";
                          availabilityClass = "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200";
                        } else if (isAvailable === "0" || isAvailable === 0 || isAvailable === false) {
                          availabilityDisplay = "Unavailable";
                          availabilityClass = "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200";
                        } else {
                          availabilityDisplay = "Unknown";
                          availabilityClass = "bg-gray-50 text-gray-700 border border-gray-200";
                        }

                        return (
                          <tr key={item.menu_id} className="border-b hover:bg-gray-50/50 transition-colors">
                            <td className="p-4">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.item_name}
                                  className="w-16 h-16 object-cover rounded-lg border-2 border-gray-100 shadow-sm"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-gray-800">{item.item_name}</p>
                              <p className="text-sm text-gray-500 mt-1">{item.description || "No description"}</p>
                            </td>
                            <td className="p-4">
                              <span className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-gray-800 text-lg">{minPrice}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${foodTypeClass}`}>
                                {foodTypeDisplay}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${availabilityClass}`}>
                                {availabilityDisplay}
                              </span>
                            </td>
                            <td className="p-4">
                              {!item.portions || item.portions.length === 0 ? (
                                <span className="text-gray-400 text-sm">—</span>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {item.portions.map((p, index) => (
                                    <span
                                      key={p.portion_id || index}
                                      className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 rounded-lg font-medium border border-indigo-100 shadow-sm"
                                    >
                                      {p.label}: ₹{p.price}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </OrderModalProvider>
  )
}
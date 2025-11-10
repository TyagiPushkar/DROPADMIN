"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function RestaurantDetailsPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
  
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(
          "https://namami-infotech.com/DROP/src/restaurants/get_restaurants.php"
        )
        const data = await res.json()
       
  
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find(
            (r) => String(r.restaurant_id) === String(id)
          )
          if (found) {
            setRestaurant(found)
          } else {
            setError("Restaurant not found")
          }
        } else {
          setError(data.message || "Invalid API response")
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err)
        setError("Failed to fetch details")
      } finally {
        setLoading(false)
      }
    }
  
    fetchRestaurant()
  }, [id])
  

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>
  if (error)
    return <div className="p-8 text-red-600 text-center">{error}</div>
  if (!restaurant)
    return <div className="p-8 text-gray-600 text-center">No data found</div>

 
  

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {restaurant.name}
      </h1>

      <div className="text-gray-700 space-y-3">
        <p><strong>Owner:</strong> {restaurant.owner_name || "N/A"}</p>
        <p><strong>Email:</strong> {restaurant.email || "N/A"}</p>
        <p><strong>Phone:</strong> {restaurant.phone || "N/A"}</p>
        <p><strong>Type:</strong> {restaurant.type || "N/A"}</p>
        <p><strong>Average Cost for Two:</strong> ₹{restaurant.avg_cost_for_two || "N/A"}</p>
        <p><strong>GST:</strong> {restaurant.gst || "N/A"}</p>
        <p><strong>FSSAI:</strong> {restaurant.fssai || "N/A"}</p>
        <p><strong>Address:</strong> {restaurant.address_line1}</p>
       
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Bank Details</h2>
        <p><strong>Account Name:</strong> {restaurant.account_name}</p>
        <p><strong>Account Number:</strong> {restaurant.account_number}</p>
        <p><strong>IFSC:</strong> {restaurant.ifsc}</p>
        <p><strong>UPI:</strong> {restaurant.upi}</p>
      </div>

      <div className="mt-6 flex gap-4">
        <div>
          <p className="font-semibold">GST Proof:</p>
          {restaurant.gst_proof ? (
            <img
              src={`https://namami-infotech.com/DROP/src/${restaurant.gst_proof}`}
              alt="GST Proof"
              className="w-40 rounded-lg shadow"
            />
          ) : (
            <p>No proof uploaded</p>
          )}
        </div>
        <div>
          <p className="font-semibold">FSSAI Proof:</p>
          {restaurant.fssai_proof ? (
            <img
              src={`https://namami-infotech.com/DROP/src/${restaurant.fssai_proof}`}
              alt="FSSAI Proof"
              className="w-40 rounded-lg shadow"
            />
          ) : (
            <p>No proof uploaded</p>
          )}
        </div>
      </div>
    </div>
  )
}

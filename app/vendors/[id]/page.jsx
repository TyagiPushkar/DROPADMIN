"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BASE_URL } from "@/app/page";

const RESTAURANT_API = BASE_URL + "restaurants/get_restaurants.php";

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(RESTAURANT_API);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const found = data.data.find(
          (r) => String(r.restaurant_id) === String(id)
        );
        if (found) {
          console.log("Fetched restaurant:", found);
          setRestaurant(found);
        } else {
          setError("Restaurant not found");
        }
      } else {
        setError(data.message || "Invalid API response");
      }
    } catch (err) {
      console.error("Error fetching restaurant:", err);
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchRestaurant();
  }, [id]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('uploads/')) {
      return `${BASE_URL}${path}`;
    }
    const cleanPath = path.replace(/^\/+/, '');
    return `${BASE_URL}${cleanPath}`;
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">{error}</div>;
  if (!restaurant) return <div className="p-8 text-gray-600 text-center">No data found</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {restaurant.name}
      </h1>

      {/* Basic Details */}
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

      {/* Bank Details */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Bank Details</h2>
        <p><strong>Account Name:</strong> {restaurant.account_name}</p>
        <p><strong>Account Number:</strong> {restaurant.account_number}</p>
        <p><strong>IFSC:</strong> {restaurant.ifsc}</p>
        <p><strong>UPI:</strong> {restaurant.upi}</p>
      </div>

      {/* Documents Section */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GST Proof */}
          <div>
            <p className="font-semibold mb-2">GST Proof:</p>
            {restaurant.gst_proof ? (
              <img
                src={getImageUrl(restaurant.gst_proof)}
                alt="GST Proof"
                className="w-full rounded-lg shadow cursor-pointer hover:opacity-90 border"
                onClick={() => window.open(getImageUrl(restaurant.gst_proof), '_blank')}
                onError={(e) => {
                  console.log("GST Error:", getImageUrl(restaurant.gst_proof));
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x200?text=GST+Not+Found";
                }}
              />
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                No GST proof
              </div>
            )}
          </div>

          {/* FSSAI Proof */}
          <div>
            <p className="font-semibold mb-2">FSSAI Proof:</p>
            {restaurant.fssai_proof ? (
              <img
                src={getImageUrl(restaurant.fssai_proof)}
                alt="FSSAI Proof"
                className="w-full rounded-lg shadow cursor-pointer hover:opacity-90 border"
                onClick={() => window.open(getImageUrl(restaurant.fssai_proof), '_blank')}
                onError={(e) => {
                  console.log("FSSAI Error:", getImageUrl(restaurant.fssai_proof));
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x200?text=FSSAI+Not+Found";
                }}
              />
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                No FSSAI proof
              </div>
            )}
          </div>

          {/* Agreement Proof - VIEW ONLY */}
          <div>
            <p className="font-semibold mb-2">Agreement Proof:</p>
            
            {restaurant.agreement_proof ? (
              <div>
                <img
                  src={getImageUrl(restaurant.agreement_proof)}
                  alt="Agreement Proof"
                  className="w-full rounded-lg shadow cursor-pointer hover:opacity-90 border"
                  onClick={() => window.open(getImageUrl(restaurant.agreement_proof), '_blank')}
                  onError={(e) => {
                    console.log("Agreement Error:", getImageUrl(restaurant.agreement_proof));
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x200?text=Agreement+Not+Found";
                  }}
                />
                <p className="text-xs text-gray-500 mt-2 truncate">
                  {restaurant.agreement_proof.split('/').pop()}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span>✓ Uploaded</span>
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                No agreement uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
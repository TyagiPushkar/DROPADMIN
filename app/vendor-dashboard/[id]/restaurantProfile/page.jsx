"use client";

import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { BASE_URL } from "@/app/page";
import { OrderModalProvider } from "../components/orderModalProvider";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import {
  BuildingStorefrontIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BanknotesIcon,
  TruckIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  PhotoIcon,
  DocumentArrowUpIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

const RESTAURANT_API = BASE_URL + "restaurants/get_restaurants.php";
const UPDATE_API = BASE_URL + "restaurants/update_restaurant.php";

export default function RestaurantProfile() {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [originalRestaurant, setOriginalRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // File upload states
  const [selectedFiles, setSelectedFiles] = useState({
    gstProof: null,
    fssaiProof: null,
    bankProof: null
  });
  const [filePreviews, setFilePreviews] = useState({
    gstProof: null,
    fssaiProof: null,
    bankProof: null
  });

  // Fetch user from cookies
  useEffect(() => {
    const raw = Cookies.get("user");
    if (!raw) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (parsed.UserType !== "Restaurant") {
        setError("Access denied");
        setLoading(false);
        return;
      }
      setUser(parsed);
    } catch (err) {
      setError("Invalid user session");
      setLoading(false);
    }
  }, []);

  // Fetch restaurant data
  useEffect(() => {
    if (!user?.Email) {
      if (user) {
        console.warn("[RestaurantProfile] User email missing");
        setLoading(false);
      }
      return;
    }

    async function fetchRestaurant() {
      try {
        setLoading(true);
        const res = await fetch(`${RESTAURANT_API}?t=${refreshKey}`);
        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          setError("Restaurant API error");
          return;
        }

        let matched = null;
        for (const r of json.data) {
          if (r.email && r.email.toLowerCase() === user.Email.toLowerCase()) {
            matched = r;
            break;
          }
        }

        if (!matched) {
          setError("No restaurant linked to this account");
          return;
        }

        // Parse arrays if they exist
        if (matched.cuisines && typeof matched.cuisines === 'string') {
          try {
            matched.cuisines = JSON.parse(matched.cuisines);
          } catch (e) {
            matched.cuisines = [];
          }
        }
        if (matched.days_open && typeof matched.days_open === 'string') {
          try {
            matched.days_open = JSON.parse(matched.days_open);
          } catch (e) {
            matched.days_open = [];
          }
        }

        setRestaurant(matched);
        setOriginalRestaurant(matched);
        setError(null);
      } catch (err) {
        setError("Failed to load restaurant profile");
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurant();
  }, [user, refreshKey]);

  // Initialize edit form when restaurant data is available
  useEffect(() => {
    if (restaurant && !isEditing) {
      setEditForm({
        restaurant_id: restaurant.restaurant_id,
        restaurant_name: restaurant.restaurant_name || "",
        description: restaurant.description || "",
        phone: restaurant.phone || "",
        email: restaurant.email || "",
        website: restaurant.website || "",
        opening_hours: restaurant.opening_hours || "",
        closing_hours: restaurant.closing_hours || "",
        address: restaurant.address || "",
        city: restaurant.city || "",
        state: restaurant.state || "",
        pincode: restaurant.pincode || "",
        price_range: restaurant.price_range || "",
        avg_cost_for_two: restaurant.avg_cost_for_two || "",
        avg_cost: restaurant.avg_cost || "",
        delivery: restaurant.delivery || 0,
        owner_name: restaurant.owner_name || "",
        account_name: restaurant.account_name || "",
        account_number: restaurant.account_number || "",
        ifsc: restaurant.ifsc || "",
        upi: restaurant.upi || "",
        gst: restaurant.gst || "",
        fssai: restaurant.fssai || "",
        gst_proof: restaurant.gst_proof || "",
        fssai_proof: restaurant.fssai_proof || "",
        bank_proof: restaurant.bank_proof || "",
        cuisines: Array.isArray(restaurant.cuisines) ? restaurant.cuisines : [],
        days_open: Array.isArray(restaurant.days_open) ? restaurant.days_open : [],
        type: restaurant.type || "",
        map_link: restaurant.map_link || "",
      });
    }
  }, [restaurant, isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (originalRestaurant) {
      setEditForm({
        restaurant_id: originalRestaurant.restaurant_id,
        restaurant_name: originalRestaurant.restaurant_name || "",
        description: originalRestaurant.description || "",
        phone: originalRestaurant.phone || "",
        email: originalRestaurant.email || "",
        website: originalRestaurant.website || "",
        opening_hours: originalRestaurant.opening_hours || "",
        closing_hours: originalRestaurant.closing_hours || "",
        address: originalRestaurant.address || "",
        city: originalRestaurant.city || "",
        state: originalRestaurant.state || "",
        pincode: originalRestaurant.pincode || "",
        price_range: originalRestaurant.price_range || "",
        avg_cost_for_two: originalRestaurant.avg_cost_for_two || "",
        avg_cost: originalRestaurant.avg_cost || "",
        delivery: originalRestaurant.delivery || 0,
        owner_name: originalRestaurant.owner_name || "",
        account_name: originalRestaurant.account_name || "",
        account_number: originalRestaurant.account_number || "",
        ifsc: originalRestaurant.ifsc || "",
        upi: originalRestaurant.upi || "",
        gst: originalRestaurant.gst || "",
        fssai: originalRestaurant.fssai || "",
        gst_proof: originalRestaurant.gst_proof || "",
        fssai_proof: originalRestaurant.fssai_proof || "",
        bank_proof: originalRestaurant.bank_proof || "",
        cuisines: Array.isArray(originalRestaurant.cuisines) ? originalRestaurant.cuisines : [],
        days_open: Array.isArray(originalRestaurant.days_open) ? originalRestaurant.days_open : [],
        type: originalRestaurant.type || "",
        map_link: originalRestaurant.map_link || "",
      });
    }
    // Clear selected files
    setSelectedFiles({
      gstProof: null,
      fssaiProof: null,
      bankProof: null
    });
    setFilePreviews({
      gstProof: null,
      fssaiProof: null,
      bankProof: null
    });
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle array fields
  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setEditForm(prev => ({
      ...prev,
      [field]: array
    }));
  };

  // Handle file selection
  const handleFileSelect = (field, file) => {
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setSaveError(`${field} file is too large (max 5MB)`);
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setSaveError(`${field} file type not supported. Use JPG, PNG, or PDF`);
      return;
    }

    setSelectedFiles(prev => ({
      ...prev,
      [field]: file
    }));

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviews(prev => ({
          ...prev,
          [field]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected file
  const handleRemoveFile = (field) => {
    setSelectedFiles(prev => ({
      ...prev,
      [field]: null
    }));
    setFilePreviews(prev => ({
      ...prev,
      [field]: null
    }));
  };

  // Save restaurant data
  const handleSave = async () => {
    if (!restaurant?.restaurant_id) return;
  
    // Basic validation
    if (!editForm.restaurant_name?.trim()) {
      setSaveError("Restaurant name is required");
      return;
    }
    if (!editForm.email?.trim()) {
      setSaveError("Email is required");
      return;
    }
    if (!editForm.phone?.trim()) {
      setSaveError("Phone number is required");
      return;
    }
  
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
  
    try {
      // Prepare data
      const dataToSend = {
        ...editForm,
        restaurant_id: restaurant.restaurant_id,
        delivery: editForm.delivery ? 1 : 0,
        cuisines: Array.isArray(editForm.cuisines) ? editForm.cuisines : [],
        days_open: Array.isArray(editForm.days_open) ? editForm.days_open : [],
        avg_cost: editForm.avg_cost?.trim() ? parseFloat(editForm.avg_cost) : null,
        avg_cost_for_two: editForm.avg_cost_for_two?.trim() ? parseFloat(editForm.avg_cost_for_two) : null
      };
      
  
      // Detect if any file is selected
      const hasFiles = Object.values(selectedFiles).some(file => file !== null);
  
      let response;
  
      if (hasFiles) {
        // Use FormData when files are present
        const formData = new FormData();
        formData.append('restaurant_data', JSON.stringify(dataToSend));
  
        Object.entries(selectedFiles).forEach(([key, file]) => {
          if (file) formData.append(key, file);
        });
  
        // Debug: check FormData keys
        // for (const pair of formData.entries()) console.log(pair[0], pair[1]);
  
        response = await fetch(UPDATE_API, {
          method: 'POST',
          body: formData
        });
  
      } else {
        // Send JSON if no files
        response = await fetch(UPDATE_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
      }
  
      if (!response.ok) {
        const text = await response.text(); // get response body for debugging
        throw new Error(`HTTP error! Status: ${response.status}. Body: ${text}`);
      }
  
      const result = await response.json();
  
      if (result.success) {
        // Update local state
        const updatedRestaurant = {
          ...restaurant,
          ...editForm,
          ...result.restaurant,
          updated_at: new Date().toISOString()
        };
  
        setRestaurant(updatedRestaurant);
        setOriginalRestaurant(updatedRestaurant);
        setIsEditing(false);
        setSaveSuccess(true);
  
        // Clear files
        setSelectedFiles({ gstProof: null, fssaiProof: null, bankProof: null });
        setFilePreviews({ gstProof: null, fssaiProof: null, bankProof: null });
  
        setRefreshKey(prev => prev + 1);
        setTimeout(() => setSaveSuccess(false), 3000);
  
      } else {
        throw new Error(result.message || "Failed to update restaurant");
      }
  
    } catch (error) {
      console.error("Save failed:", error);
      setSaveError(error.message || "Failed to save changes. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };
  

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationBadge = (isVerified) => {
    return isVerified == 1 ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
        <CheckBadgeIcon className="h-4 w-4" />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
        <ExclamationCircleIcon className="h-4 w-4" />
        Not Verified
      </span>
    );
  };

  const getDeliveryBadge = (delivery) => {
    return delivery == 1 ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
        <TruckIcon className="h-4 w-4" />
        Delivery Available
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
        <TruckIcon className="h-4 w-4" />
        No Delivery
      </span>
    );
  };

  // File upload component
  const FileUploadField = ({ label, field, currentFileUrl }) => {
    const hasFile = selectedFiles[field] || currentFileUrl;
    const preview = filePreviews[field] || currentFileUrl;
    const isImage = preview && (preview.startsWith('data:image') || 
                  currentFileUrl?.match(/\.(jpg|jpeg|png|gif)$/i));

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => document.getElementById(`${field}-file`).click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <DocumentArrowUpIcon className="h-4 w-4" />
                {hasFile ? 'Change File' : 'Upload File'}
              </button>
              
              <input
                id={`${field}-file`}
                type="file"
                onChange={(e) => handleFileSelect(field, e.target.files[0])}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
              />
              
              {hasFile && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile(field)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            
            {hasFile && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isImage ? (
                      <div className="relative w-20 h-20">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedFiles[field]?.name || currentFileUrl?.split('/').pop()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedFiles[field] ? 
                          `${(selectedFiles[field].size / 1024 / 1024).toFixed(2)} MB` : 
                          'Existing file'}
                      </p>
                    </div>
                  </div>
                  
                  {currentFileUrl && !selectedFiles[field] && (
                    <a
                      href={currentFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {!hasFile && (
              <p className="text-sm text-gray-500 italic">
                No file selected. Allowed: JPG, PNG, PDF (max 5MB)
              </p>
            )}
          </div>
        ) : (
          <div>
            {currentFileUrl ? (
              <div className="flex items-center gap-3">
                {isImage ? (
                  <div className="relative w-20 h-20">
                    <img
                      src={currentFileUrl}
                      alt={label}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {currentFileUrl.split('/').pop()}
                  </p>
                  <a
                    href={currentFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View Document
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No document uploaded</p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <OrderModalProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar open={open} setOpen={setOpen} />
          <div className="flex-1 flex flex-col">
            <Navbar setOpen={setOpen} />
            <div className="p-6 md:p-8">
              <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="mt-12 text-center">
                <div className="inline-flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin" />
                  <span className="text-gray-600 font-medium">Loading restaurant profile...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </OrderModalProvider>
    );
  }

  if (error) {
    return (
      <OrderModalProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar open={open} setOpen={setOpen} />
          <div className="flex-1 flex flex-col">
            <Navbar setOpen={setOpen} />
            <div className="p-6 md:p-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-red-800">Error Loading Profile</h3>
                      <p className="mt-1 text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setRefreshKey(prev => prev + 1)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </OrderModalProvider>
    );
  }

  if (!restaurant) {
    return (
      <OrderModalProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar open={open} setOpen={setOpen} />
          <div className="flex-1 flex flex-col">
            <Navbar setOpen={setOpen} />
            <div className="p-6 md:p-8">
              <div className="text-center py-12">
                <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Restaurant Found</h3>
                <p className="text-gray-600">Please contact support to link your account to a restaurant.</p>
              </div>
            </div>
          </div>
        </div>
      </OrderModalProvider>
    );
  }

  return (
    <OrderModalProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="flex-1 flex flex-col">
          <Navbar setOpen={setOpen} />
          
          <div className="p-4 md:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Restaurant Profile</h1>
                <p className="text-gray-600 mt-1">Manage your restaurant details and settings</p>
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                    <CheckIcon className="h-4 w-4" />
                    Changes saved successfully!
                  </div>
                )}
                
                <button
                  onClick={() => setRefreshKey(prev => prev + 1)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Refresh
                </button>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={saveLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saveLoading ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {saveError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <div className="flex items-center gap-2">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {saveError}
                </div>
              </div>
            )}

            {/* Main Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              {/* Restaurant Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <BuildingStorefrontIcon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.restaurant_name}
                            onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
                            className="text-3xl font-bold bg-white/20 text-white placeholder-white/70 rounded-lg px-3 py-2 w-full max-w-md"
                            placeholder="Restaurant Name"
                          />
                        ) : (
                          <h2 className="text-3xl font-bold text-white">{restaurant.restaurant_name}</h2>
                        )}
                        {getVerificationBadge(restaurant.is_verified)}
                      </div>
                      {isEditing ? (
                        <textarea
                          value={editForm.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className="bg-white/20 text-white placeholder-white/70 rounded-lg px-3 py-2 w-full mt-2 resize-none"
                          placeholder="Description"
                          rows="2"
                        />
                      ) : (
                        <p className="text-blue-100 text-lg">{restaurant.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-2 rounded-full font-medium ${getStatusBadgeColor(restaurant.status)}`}>
                        {restaurant.status?.toUpperCase()}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-white/20 text-white font-medium">
                        {restaurant.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-6 w-6 text-yellow-300" />
                          <span className="text-2xl font-bold text-white">{restaurant.rating || 'N/A'}</span>
                        </div>
                        <p className="text-blue-100 text-sm">
                          ({restaurant.total_reviews || 0} reviews)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 md:p-8">
                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <InfoCard
                    label="Email"
                    value={restaurant.email}
                    icon={EnvelopeIcon}
                    editing={isEditing}
                    editValue={editForm.email}
                    onEditChange={(value) => handleInputChange('email', value)}
                    type="email"
                  />
                  
                  <InfoCard
                    label="Phone"
                    value={restaurant.phone}
                    icon={PhoneIcon}
                    editing={isEditing}
                    editValue={editForm.phone}
                    onEditChange={(value) => handleInputChange('phone', value)}
                    type="tel"
                  />
                  
                  <InfoCard
                    label="Website"
                    value={restaurant.website}
                    icon={GlobeAltIcon}
                    editing={isEditing}
                    editValue={editForm.website}
                    onEditChange={(value) => handleInputChange('website', value)}
                    type="url"
                    isLink={true}
                  />
                  
                  <InfoCard
                    label="Opening Hours"
                    value={restaurant.opening_hours}
                    icon={ClockIcon}
                    editing={isEditing}
                    editValue={editForm.opening_hours}
                    onEditChange={(value) => handleInputChange('opening_hours', value)}
                  />
                  
                  <InfoCard
                    label="Avg. Cost for Two"
                    value={restaurant.avg_cost_for_two ? `₹${restaurant.avg_cost_for_two}` : "N/A"}
                    icon={CurrencyDollarIcon}
                    editing={isEditing}
                    editValue={editForm.avg_cost_for_two}
                    onEditChange={(value) => handleInputChange('avg_cost_for_two', value)}
                  />
                  
                  <InfoCard
                    label="Price Range"
                    value={restaurant.price_range || "Not set"}
                    icon={UserGroupIcon}
                    editing={isEditing}
                    editValue={editForm.price_range}
                    onEditChange={(value) => handleInputChange('price_range', value)}
                  />
                </div>

                {/* Address Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPinIcon className="h-6 w-6 text-gray-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Address Information</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                          <textarea
                            value={editForm.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                              type="text"
                              value={editForm.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                              type="text"
                              value={editForm.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input
                              type="text"
                              value={editForm.pincode}
                              onChange={(e) => handleInputChange('pincode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-2">{restaurant.address}</p>
                        <div className="flex flex-wrap gap-4 text-gray-600">
                          {restaurant.city && <span>City: {restaurant.city}</span>}
                          {restaurant.state && <span>State: {restaurant.state}</span>}
                          {restaurant.pincode && <span>Pincode: {restaurant.pincode}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Compliance Status */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700">FSSAI License</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            restaurant.fssai ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {restaurant.fssai ? 'Registered' : 'Pending'}
                          </span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.fssai || ""}
                            onChange={(e) => handleInputChange('fssai', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter FSSAI Number"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{restaurant.fssai || "Not provided"}</p>
                        )}
                        <FileUploadField
                          label="FSSAI Proof Document"
                          field="fssaiProof"
                          currentFileUrl={restaurant.fssai_proof}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <BanknotesIcon className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700">GST Registration</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            restaurant.gst ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {restaurant.gst ? 'Registered' : 'Pending'}
                          </span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.gst || ""}
                            onChange={(e) => handleInputChange('gst', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter GST Number"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{restaurant.gst || "Not provided"}</p>
                        )}
                        <FileUploadField
                          label="GST Proof Document"
                          field="gstProof"
                          currentFileUrl={restaurant.gst_proof}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCardIcon className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Restaurant ID</span>
                        <span className="font-medium text-gray-900">{restaurant.restaurant_id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Delivery Service</span>
                        {getDeliveryBadge(restaurant.delivery)}
                      </div>
                      {restaurant.owner_name && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Owner Name</span>
                          <span className="font-medium text-gray-900">{restaurant.owner_name}</span>
                        </div>
                      )}
                      {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-700 mb-1">Cuisines</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={Array.isArray(editForm.cuisines) ? editForm.cuisines.join(', ') : ""}
                              onChange={(e) => handleArrayChange('cuisines', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Indian, Chinese, Italian"
                            />
                          ) : (
                            <p className="text-gray-900">{restaurant.cuisines.join(', ')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bank Details & Timestamps */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                      <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.account_name || ""}
                            onChange={(e) => handleInputChange('account_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{restaurant.account_name || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.account_number || ""}
                            onChange={(e) => handleInputChange('account_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{restaurant.account_number || "Not provided"}</p>
                        )}
                      </div>
                      
                      <FileUploadField
                        label="Bank Proof Document"
                        field="bankProof"
                        currentFileUrl={restaurant.bank_proof}
                      />
                      
                      <div className="pt-4 border-t border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">Account Created</p>
                        <p className="font-medium text-gray-900">{formatDateTime(restaurant.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                        <p className="font-medium text-gray-900">{formatDateTime(restaurant.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Last synchronized: {new Date().toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Changes may take a few minutes to reflect across all systems
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Restaurant ID: {restaurant.restaurant_id}</span>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <span className="text-sm text-gray-600">Email: {restaurant.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrderModalProvider>
  );
}

// Enhanced InfoCard component with edit support
function InfoCard({ label, value, icon: Icon, editing = false, editValue, onEditChange, type = "text", isLink = false, prefix = "" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <h4 className="font-medium text-gray-700">{label}</h4>
      </div>
      
      {editing ? (
        <div>
          {type === "textarea" ? (
            <textarea
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          ) : (
            <input
              type={type}
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          )}
        </div>
      ) : (
        <div>
          {isLink && value && value.startsWith('http') ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-lg break-all"
            >
              {value.replace(/^https?:\/\//, '')}
            </a>
          ) : (
            <p className="text-gray-900 font-medium text-lg">
              {prefix && value && value !== "N/A" && !value.includes("Not set") ? prefix : ""}{value || "—"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
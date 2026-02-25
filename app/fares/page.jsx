"use client";
import { useState, useEffect } from "react";
import { BASE_URL } from "../page";
import {
  MapPin,
  IndianRupee,
  Clock,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Calendar,
  ChevronRight,
  X,
  Filter,
  Eye,
} from "lucide-react";

export default function Pincodes() {
  const [pincodes, setPincodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPhase, setFilterPhase] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPincode, setSelectedPincode] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    phase: "",
    area_name: "",
    pin_code: "",
    min_base_price: "",
    price_per_km: "",
    min_km_limit: "",
    night_start_time: "",
    night_end_time: "",
    night_charge_type: "Late Night Charges",
    night_charge_value: "",
    peak_hour_multiplier: "0",
    effective_from: "",
    status: "1",
  });

  // Fetch pincodes
  useEffect(() => {
    const fetchPincodes = async () => {
      setLoading(true);
      try {
        const response = await fetch(BASE_URL + "rides/get_pin_codes.php");
        const data = await response.json();
        setPincodes(data.data || []);
      } catch (error) {
        console.error("Error fetching pincodes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPincodes();
  }, []);

  // Filter pincodes
  const filteredPincodes = pincodes.filter((pincode) => {
    const matchesSearch =
      searchTerm === "" ||
      pincode.area_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pincode.pin_code.includes(searchTerm);

    const matchesPhase = filterPhase === "all" || pincode.phase === filterPhase;
    const matchesStatus =
      filterStatus === "all" || pincode.status === filterStatus;

    return matchesSearch && matchesPhase && matchesStatus;
  });

  // Get unique phases for filter
  const phases = [...new Set(pincodes.map((p) => p.phase))].sort();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format time (24h to 12h)
  const formatTime = (timeString) => {
    if (!timeString) return "—";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calculate night hours duration
  const calculateNightHours = (start, end) => {
    if (!start || !end) return "—";
    try {
      const startHour = parseInt(start.split(":")[0]);
      const endHour = parseInt(end.split(":")[0]);

      let duration;
      if (endHour > startHour) {
        duration = endHour - startHour;
      } else {
        duration = 24 - startHour + endHour;
      }

      return `${duration} hours`;
    } catch (e) {
      return "—";
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new pincode
  const handleAddPincode = async () => {
    // Validate form data
    if (
      !formData.area_name ||
      !formData.pin_code ||
      !formData.min_base_price ||
      !formData.price_per_km
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(BASE_URL + "rides/add_pin_code.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh pincodes list
        const updatedResponse = await fetch(
          BASE_URL + "rides/get_pin_codes.php"
        );
        const updatedData = await updatedResponse.json();
        setPincodes(updatedData.data || []);
        setShowAddModal(false);
        resetForm();
      } else {
        alert(result.message || "Failed to add pincode");
      }
    } catch (error) {
      console.error("Error adding pincode:", error);
      alert("Error adding pincode");
    }
  };

  // Edit pincode
  const handleEditPincode = async () => {
    try {
      const response = await fetch(BASE_URL + "rides/edit_pin_code.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedPincode.id,
          ...formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh pincodes list
        const updatedResponse = await fetch(
          BASE_URL + "rides/get_pin_codes.php"
        );
        const updatedData = await updatedResponse.json();
        setPincodes(updatedData.data || []);
        setShowEditModal(false);
        resetForm();
      } else {
        alert(result.message || "Failed to update pincode");
      }
    } catch (error) {
      console.error("Error updating pincode:", error);
      alert("Error updating pincode");
    }
  };

  // Delete pincode
  const handleDeletePincode = async () => {
    try {
      const response = await fetch(BASE_URL + "rides/delete_pin_code.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedPincode.id }),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh pincodes list
        const updatedResponse = await fetch(
          BASE_URL + "rides/get_pin_codes.php"
        );
        const updatedData = await updatedResponse.json();
        setPincodes(updatedData.data || []);
        setShowDeleteModal(false);
        setSelectedPincode(null);
      } else {
        alert(result.message || "Failed to delete pincode");
      }
    } catch (error) {
      console.error("Error deleting pincode:", error);
      alert("Error deleting pincode");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      phase: "",
      area_name: "",
      pin_code: "",
      min_base_price: "",
      price_per_km: "",
      min_km_limit: "",
      night_start_time: "",
      night_end_time: "",
      night_charge_type: "Late Night Charges",
      night_charge_value: "",
      peak_hour_multiplier: "0",
      effective_from: "",
      status: "1",
    });
  };

  // Open edit modal
  const openEditModal = (pincode) => {
    setSelectedPincode(pincode);
    setFormData({
      phase: pincode.phase,
      area_name: pincode.area_name,
      pin_code: pincode.pin_code,
      min_base_price: pincode.min_base_price,
      price_per_km: pincode.price_per_km,
      min_km_limit: pincode.min_km_limit,
      night_start_time: pincode.night_start_time,
      night_end_time: pincode.night_end_time,
      night_charge_type: pincode.night_charge_type,
      night_charge_value: pincode.night_charge_value,
      peak_hour_multiplier: pincode.peak_hour_multiplier,
      effective_from: pincode.effective_from.split("T")[0],
      status: pincode.status,
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Pincode Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage pincode-wise pricing and configurations
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add New Pincode
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search area name or pincode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
              />
            </div>
          </div>

          {/* Phase Filter */}
          <div>
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer text-sm bg-white"
            >
              <option value="all">All Phases</option>
              {phases.map((phase) => (
                <option key={phase} value={phase}>
                  Phase {phase}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500">Total Pincodes</div>
          <div className="text-2xl font-bold text-gray-900">{pincodes.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {pincodes.filter(p => p.status === "1").length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500">Inactive</div>
          <div className="text-2xl font-bold text-red-600">
            {pincodes.filter(p => p.status === "0").length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500">Filtered</div>
          <div className="text-2xl font-bold text-blue-600">
            {filteredPincodes.length}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading pincodes...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Pincode Details
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Pricing
                    </th>
                    {/* <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Night Charges
                    </th> */}
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Timeline
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPincodes.map((pincode) => (
                    <tr
                      key={pincode.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Pincode Details */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {pincode.pin_code}
                            </div>
                            <div className="text-sm text-gray-600">
                              {pincode.area_name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {pincode.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Base Price:</span>
                            <span className="font-medium flex items-center">
                              <IndianRupee className="w-3.5 h-3.5 mr-1" />
                              {pincode.min_base_price}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Price/KM:</span>
                            <span className="font-medium flex items-center">
                              <IndianRupee className="w-3.5 h-3.5 mr-1" />
                              {pincode.price_per_km}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Min KM:</span>
                            <span className="font-medium">{pincode.min_km_limit} km</span>
                          </div>
                        </div>
                      </td>

                      {/* Night Charges */}
                      {/* <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4 text-purple-500" />
                            <span className="text-sm">
                              {formatTime(pincode.night_start_time)} - {formatTime(pincode.night_end_time)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {pincode.night_charge_type}
                          </div>
                          <div className="text-sm font-medium flex items-center">
                            <IndianRupee className="w-3.5 h-3.5 mr-1" />
                            {pincode.night_charge_value}
                          </div>
                        </div>
                      </td> */}

                      {/* Status */}
                      <td className="p-4">
                        <div className="space-y-3">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Phase {pincode.phase}
                          </div>
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            pincode.status === "1"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {pincode.status === "1" ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                Inactive
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Timeline */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(pincode.effective_from)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Updated: {new Date(pincode.updated_at).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPincode(pincode)}
                            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(pincode)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPincode(pincode);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPincodes.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-3">No pincodes found</div>
                <p className="text-gray-500 text-sm">
                  {searchTerm || filterPhase !== "all" || filterStatus !== "all"
                    ? "Try changing your filters or search term"
                    : "Add your first pincode to get started"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AddEditModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Pincode"
        formData={formData}
        handleInputChange={handleInputChange}
        onSubmit={handleAddPincode}
        submitLabel="Add Pincode"
      />

      <AddEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Pincode"
        formData={formData}
        handleInputChange={handleInputChange}
        onSubmit={handleEditPincode}
        submitLabel="Update Pincode"
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPincode(null);
        }}
        pincode={selectedPincode}
        onConfirm={handleDeletePincode}
      />

      <ViewDetailsModal
        isOpen={selectedPincode && !showEditModal && !showDeleteModal}
        onClose={() => setSelectedPincode(null)}
        pincode={selectedPincode}
        onEdit={() => openEditModal(selectedPincode)}
        onDelete={() => setShowDeleteModal(true)}
      />
    </div>
  );
}

// Add/Edit Modal Component
function AddEditModal({ isOpen, onClose, title, formData, handleInputChange, onSubmit, submitLabel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phase *
                </label>
                <select
                  name="phase"
                  value={formData.phase}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="">Select Phase</option>
                  <option value="1">Phase 1</option>
                  <option value="2">Phase 2</option>
                  <option value="3">Phase 3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area Name *
                </label>
                <input
                  type="text"
                  name="area_name"
                  value={formData.area_name}
                  onChange={handleInputChange}
                  placeholder="e.g., KOLKATA"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pin_code"
                  value={formData.pin_code}
                  onChange={handleInputChange}
                  placeholder="e.g., 700107"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Pricing Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Base Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="min_base_price"
                    value={formData.min_base_price}
                    onChange={handleInputChange}
                    placeholder="25"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per KM *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price_per_km"
                    value={formData.price_per_km}
                    onChange={handleInputChange}
                    placeholder="9.75"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum KM Limit
                </label>
                <input
                  type="number"
                  name="min_km_limit"
                  value={formData.min_km_limit}
                  onChange={handleInputChange}
                  placeholder="2"
                  step="0.1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peak Hour Multiplier
                </label>
                <input
                  type="number"
                  name="peak_hour_multiplier"
                  value={formData.peak_hour_multiplier}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Night Charges */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold text-gray-900">Night Charges Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Night Start Time
                  </label>
                  <input
                    type="time"
                    name="night_start_time"
                    value={formData.night_start_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Night End Time
                  </label>
                  <input
                    type="time"
                    name="night_end_time"
                    value={formData.night_end_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Night Charge Type
                  </label>
                  <select
                    name="night_charge_type"
                    value={formData.night_charge_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Late Night Charges">Late Night Charges</option>
                    <option value="Percentage Increase">Percentage Increase</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Night Charge Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {formData.night_charge_type === "Percentage Increase" ? "%" : "₹"}
                    </span>
                    <input
                      type="number"
                      name="night_charge_value"
                      value={formData.night_charge_value}
                      onChange={handleInputChange}
                      placeholder={
                        formData.night_charge_type === "Percentage Increase"
                          ? "20"
                          : "20"
                      }
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective From
                  </label>
                  <input
                    type="date"
                    name="effective_from"
                    value={formData.effective_from}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Modal Component
function DeleteModal({ isOpen, onClose, pincode, onConfirm }) {
  if (!isOpen || !pincode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Delete Pincode</h3>
              <p className="text-red-700 text-sm mt-1">
                Are you sure you want to delete pincode <strong>{pincode.pin_code}</strong> - {pincode.area_name}? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
            >
              Delete Pincode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// View Details Modal Component
function ViewDetailsModal({ isOpen, onClose, pincode, onEdit, onDelete }) {
  if (!isOpen || !pincode) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "—";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Pincode Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{pincode.pin_code}</h3>
              <p className="text-gray-600">{pincode.area_name}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                pincode.status === "1"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {pincode.status === "1" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Inactive
                  </>
                )}
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Phase {pincode.phase}
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4">Base Pricing</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Minimum Base Price</span>
                  <span className="font-bold text-lg flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {pincode.min_base_price}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price per KM</span>
                  <span className="font-bold text-lg flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {pincode.price_per_km}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Minimum KM Limit</span>
                  <span className="font-bold text-lg">{pincode.min_km_limit} km</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4">Night Charges</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">Timings:</span>
                  <span className="font-medium">
                    {formatTime(pincode.night_start_time)} - {formatTime(pincode.night_end_time)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Charge Type:</span>
                  <div className="font-medium mt-1">{pincode.night_charge_type}</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Additional Charge</span>
                  <span className="font-bold text-lg flex items-center">
                    {pincode.night_charge_type === "Percentage Increase" ? (
                      <>{pincode.night_charge_value}%</>
                    ) : (
                      <>
                        <IndianRupee className="w-4 h-4 mr-1" />
                        {pincode.night_charge_value}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-4">Additional Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Peak Hour Multiplier</span>
                  <span className="font-bold text-lg">{pincode.peak_hour_multiplier}x</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Effective From:</span>
                  <span className="font-medium">{formatDate(pincode.effective_from)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Pincode ID:</span>
                  <div className="font-medium font-mono mt-1">#{pincode.id}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-4">Timeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Created At</div>
                <div className="font-medium">
                  {new Date(pincode.created_at).toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                <div className="font-medium">
                  {new Date(pincode.updated_at).toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  pincode.status === "1"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {pincode.status === "1" ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onDelete}
              className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={onEdit}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Pincode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
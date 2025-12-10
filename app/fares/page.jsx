"use client";
import { useState, useEffect } from "react";
import { BASE_URL } from "../page";
import {
  MapPin,
  Hash,
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
  Filter,
  Calendar,
  ChevronRight,
  X,
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
      <div className="mx-2">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                All Pincodes
              </h1>
              <p className="text-gray-600 mt-2">
                Manage pincode-wise pricing and configurations
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add New Pincode
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by area or pincode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Phase Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Phase
              </label>
              <select
                value={filterPhase}
                onChange={(e) => setFilterPhase(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading pincodes...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Pincode & Area
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Night Charges
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Phase & Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                      Effective From
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
                      className="hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-gray-900 text-lg">
                              {pincode.pin_code}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {pincode.area_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {pincode.id}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Base Price
                            </div>
                            <div className="flex items-center gap-1 font-medium text-gray-900">
                              <IndianRupee className="w-3.5 h-3.5" />
                              {pincode.min_base_price}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Price per KM
                            </div>
                            <div className="flex items-center gap-1 font-medium text-gray-900">
                              <IndianRupee className="w-3.5 h-3.5" />
                              {pincode.price_per_km}/km
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Min Distance
                            </div>
                            <div className="font-medium text-gray-900">
                              {pincode.min_km_limit} km
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Timings
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Moon className="w-3.5 h-3.5 text-purple-500" />
                              {formatTime(pincode.night_start_time)}
                              <span className="text-gray-400">to</span>
                              <Sun className="w-3.5 h-3.5 text-yellow-500" />
                              {formatTime(pincode.night_end_time)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              (
                              {calculateNightHours(
                                pincode.night_start_time,
                                pincode.night_end_time
                              )}
                              )
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Charge Type
                            </div>
                            <div className="font-medium text-gray-900">
                              {pincode.night_charge_type}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Charge Value
                            </div>
                            <div className="flex items-center gap-1 font-medium text-gray-900">
                              <IndianRupee className="w-3.5 h-3.5" />
                              {pincode.night_charge_value}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Phase
                            </div>
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                pincode.phase === "1"
                                  ? "bg-blue-100 text-blue-800"
                                  : pincode.phase === "2"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              Phase {pincode.phase}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              Status
                            </div>
                            <div
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                pincode.status === "1"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
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
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {formatDate(pincode.effective_from)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last updated:{" "}
                            {new Date(pincode.updated_at).toLocaleDateString(
                              "en-IN"
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
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
                          <button
                            onClick={() => setSelectedPincode(pincode)}
                            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPincodes.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No pincodes found</div>
                  <p className="text-gray-500 text-sm">
                    {searchTerm ||
                    filterPhase !== "all" ||
                    filterStatus !== "all"
                      ? "Try changing your filters or search term"
                      : "Add your first pincode to get started"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Pincode Modal */}
      {showAddModal && (
        <Modal
          title="Add New Pincode"
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
        >
          <PincodeForm
            formData={formData}
            handleInputChange={handleInputChange}
            onSubmit={handleAddPincode}
            submitLabel="Add Pincode"
          />
        </Modal>
      )}

      {/* Edit Pincode Modal */}
      {showEditModal && (
        <Modal
          title="Edit Pincode"
          onClose={() => {
            setShowEditModal(false);
            resetForm();
          }}
        >
          <PincodeForm
            formData={formData}
            handleInputChange={handleInputChange}
            onSubmit={handleEditPincode}
            submitLabel="Update Pincode"
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPincode && (
        <Modal
          title="Delete Pincode"
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedPincode(null);
          }}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">
                Are you sure you want to delete pincode{" "}
                <strong>{selectedPincode.pin_code}</strong> -{" "}
                {selectedPincode.area_name}? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPincode(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePincode}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete Pincode
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Details Modal */}
      {selectedPincode && !showEditModal && !showDeleteModal && (
        <ViewDetailsModal
          pincode={selectedPincode}
          onClose={() => setSelectedPincode(null)}
          onEdit={() => openEditModal(selectedPincode)}
          onDelete={() => {
            setShowDeleteModal(true);
          }}
        />
      )}
    </div>
  );
}

// Modal Component
function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 p-6">
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
        {children}
      </div>
    </div>
  );
}

// Pincode Form Component
function PincodeForm({ formData, handleInputChange, onSubmit, submitLabel }) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            // This will be handled by the parent modal close
          }}
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
  );
}

// View Details Modal
function ViewDetailsModal({ pincode, onClose, onEdit, onDelete }) {
  return (
    <Modal title="Pincode Details" onClose={onClose}>
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="text-sm text-blue-700 mb-1">Base Fare</div>
            <div className="text-2xl font-bold text-blue-900 flex items-center">
              <IndianRupee className="w-6 h-6" />
              {pincode.min_base_price}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="text-sm text-green-700 mb-1">Per KM Rate</div>
            <div className="text-2xl font-bold text-green-900 flex items-center">
              <IndianRupee className="w-6 h-6" />
              {pincode.price_per_km}
              <span className="text-lg ml-1">/km</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="text-sm text-purple-700 mb-1">Min Distance</div>
            <div className="text-2xl font-bold text-purple-900">
              {pincode.min_km_limit} km
            </div>
          </div>
        </div>

        {/* Area & Phase Info */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Area Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Area Name</div>
              <div className="font-medium text-lg">{pincode.area_name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Pincode</div>
              <div className="font-bold text-2xl text-gray-900">
                {pincode.pin_code}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Phase</div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  pincode.phase === "1"
                    ? "bg-blue-100 text-blue-800"
                    : pincode.phase === "2"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Phase {pincode.phase}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Status</div>
              <div
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  pincode.status === "1"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
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
            </div>
          </div>
        </div>

        {/* Night Charges */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-purple-600" />
            Night Charges Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Night Hours</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">
                      {formatTime(pincode.night_start_time)}
                    </span>
                  </div>
                  <span className="text-gray-400">to</span>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">
                      {formatTime(pincode.night_end_time)}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Duration:{" "}
                  {calculateNightHours(
                    pincode.night_start_time,
                    pincode.night_end_time
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Charge Type</div>
                <div className="font-medium">{pincode.night_charge_type}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Additional Charge
                </div>
                <div className="text-2xl font-bold text-purple-700 flex items-center">
                  {pincode.night_charge_type === "Percentage Increase" ? (
                    <>{pincode.night_charge_value}%</>
                  ) : (
                    <>
                      <IndianRupee className="w-6 h-6" />
                      {pincode.night_charge_value}
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Peak Hour Multiplier
                </div>
                <div className="text-xl font-bold text-orange-700">
                  {pincode.peak_hour_multiplier}x
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Timeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Effective From</div>
              <div className="font-medium">
                {formatDate(pincode.effective_from)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Created At</div>
              <div className="font-medium">
                {new Date(pincode.created_at).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="font-medium">
                {new Date(pincode.updated_at).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Pincode ID</div>
              <div className="font-medium font-mono">#{pincode.id}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={onDelete}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2"
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
    </Modal>
  );
}

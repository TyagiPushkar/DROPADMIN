"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../page";
import {
  User,
  Phone,
  Hash,
  FileText,
  Car,
  ShieldCheck,
  Calendar,
  Clock,
  IdCard,
  Car as CarIcon,
  FileCheck,
  Search,
  Filter,
  ChevronDown,
  Download,
  Users,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  MoreVertical,
  FileWarning,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Shield
} from "lucide-react";

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [documentFilter, setDocumentFilter] = useState("all");

  useEffect(() => {
    fetch(BASE_URL + "rider/get_all_rider.php")
      .then((res) => res.json())
      .then((data) => {
        setRiders(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter riders based on search and filters
  const filteredRiders = riders.filter(rider => {
    // Search filter
    const matchesSearch = searchQuery === "" ||
      (rider.Name && rider.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rider.PhoneNumber && rider.PhoneNumber.includes(searchQuery)) ||
      (rider.AadharCardNumber && rider.AadharCardNumber.includes(searchQuery)) ||
      (rider.VehicleNumber && rider.VehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === "all" ||
      rider.Status === statusFilter ||
      (statusFilter === "pending" && (!rider.Status || rider.Status === "")) ||
      (statusFilter === "approved" && rider.Status === "Approved") ||
      (statusFilter === "rejected" && rider.Status === "Rejected");

    // Document filter
    let matchesDocument = true;
    if (documentFilter !== "all") {
      switch (documentFilter) {
        case "complete":
          matchesDocument = rider.AadharCardFrontURL &&
            rider.VehicleNumberPlatePhotoURL &&
            rider.VehicleImageURL &&
            rider.INSURANCE_IMAGE &&
            rider.RC_IMAGE;
          break;
        case "incomplete":
          matchesDocument = !rider.AadharCardFrontURL ||
            !rider.VehicleNumberPlatePhotoURL ||
            !rider.VehicleImageURL ||
            !rider.INSURANCE_IMAGE ||
            !rider.RC_IMAGE;
          break;
        case "expired":
          matchesDocument = rider.INSURANCE_EXPIRY_DATE &&
            new Date(rider.INSURANCE_EXPIRY_DATE) < new Date();
          break;
      }
    }

    // Date filter (if you have date fields)
    const matchesDate = dateFilter === "all" || true; // Implement date filtering if needed

    return matchesSearch && matchesStatus && matchesDocument && matchesDate;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "Approved") return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        Approved
      </span>
    );
    if (status === "Rejected") return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
        Rejected
      </span>
    );
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
        Pending
      </span>
    );
  };

  const getActionButtonColor = (status) => {
    if (status === "Approved") return "bg-red-100 text-red-800 hover:bg-red-200";
    if (status === "Rejected") return "bg-green-100 text-green-800 hover:bg-green-200";
    return "bg-blue-100 text-blue-800 hover:bg-blue-200";
  };

  const getStatusActionText = (status) => {
    if (status === "Approved") return "Reject";
    if (status === "Rejected") return "Approve";
    return "Approve";
  };

  const handleApproveToggle = async (riderId, currentStatus) => {
    try {
      setUpdatingId(riderId);

      let newStatus;
      if (currentStatus === "Approved") newStatus = "Rejected";
      else if (currentStatus === "Rejected") newStatus = "Approved";
      else newStatus = "Approved";

      const response = await fetch(BASE_URL + "rider/update_rider_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ RiderId: riderId, Status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        setRiders((prev) =>
          prev.map((r) =>
            r.RiderId === riderId ? { ...r, Status: newStatus } : r
          )
        );
      } else {
        alert("Failed: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const DocumentBadge = ({ available, text }) => (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
        available
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-100"
      }`}
    >
      {available ? (
        <FileCheck className="w-3 h-3 mr-1.5" />
      ) : (
        <FileWarning className="w-3 h-3 mr-1.5" />
      )}
      {text}
    </div>
  );

  // Calculate statistics
  const stats = {
    total: riders.length,
    approved: riders.filter(r => r.Status === "Approved").length,
    pending: riders.filter(r => !r.Status || r.Status === "").length,
    rejected: riders.filter(r => r.Status === "Rejected").length,
    documentsComplete: riders.filter(r =>
      r.AadharCardFrontURL &&
      r.VehicleNumberPlatePhotoURL &&
      r.VehicleImageURL &&
      r.INSURANCE_IMAGE &&
      r.RC_IMAGE
    ).length,
    insuranceExpired: riders.filter(r =>
      r.INSURANCE_EXPIRY_DATE &&
      new Date(r.INSURANCE_EXPIRY_DATE) < new Date()
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="mx-2">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rider Management Dashboard</h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">Manage rider profiles, documents, and approval status</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Riders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, Aadhar, or vehicle number..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    value={documentFilter}
                    onChange={(e) => setDocumentFilter(e.target.value)}
                  >
                    <option value="all">All Documents</option>
                    <option value="complete">Documents Complete</option>
                    <option value="incomplete">Documents Incomplete</option>
                    <option value="expired">Insurance Expired</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setDocumentFilter("all");
                  }}
                  className="px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredRiders.length}</span> of <span className="font-semibold">{riders.length}</span> riders
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{stats.documentsComplete} Complete</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>{stats.insuranceExpired} Expired</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop/Tablet View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border">
            <div className="animate-spin h-12 w-12 border-2 border-blue-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">Loading riders...</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-900 to-gray-800">
                        <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <Hash className="w-4 h-4" />
                            </div>
                            <span>SL</span>
                          </div>
                        </th>
                        <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <User className="w-4 h-4" />
                            </div>
                            <span>Rider Info</span>
                          </div>
                        </th>
                        <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span>Documents</span>
                          </div>
                        </th>
                        <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <CarIcon className="w-4 h-4" />
                            </div>
                            <span>Vehicle</span>
                          </div>
                        </th>
                        <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <Shield className="w-4 h-4" />
                            </div>
                            <span>Insurance</span>
                          </div>
                        </th>
                        <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <span>Dates</span>
                          </div>
                        </th>
                        <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <span>Status</span>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredRiders.map((rider, index) => (
                        <tr
                          key={rider.RiderId}
                          className="hover:bg-gray-50/80 transition-colors duration-150 group cursor-pointer"
                          onClick={(e) => {
                            if (e.target.tagName !== "BUTTON") {
                              localStorage.setItem("selectedRider", JSON.stringify(rider));
                              router.push(`/riders/${rider.RiderId}`);
                            }
                          }}
                        >
                          <td className="p-6">
                            <span className="font-semibold text-gray-900">{index + 1}</span>
                          </td>

                          {/* Rider Info */}
                          <td className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-150">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="font-bold text-gray-900">{rider.Name}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{rider.PhoneNumber}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Hash className="w-3.5 h-3.5" />
                              <span className="font-mono">{rider.AadharCardNumber}</span>
                            </div>
                          </td>

                          {/* Docs */}
                          <td className="p-6">
                            <div className="flex flex-col gap-2">
                              <DocumentBadge
                                available={rider.AadharCardFrontURL}
                                text="Aadhar"
                              />
                            </div>
                          </td>

                          {/* Vehicle */}
                          <td className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                              <CarIcon className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-gray-900">{rider.VehicleNumber}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <DocumentBadge
                                available={rider.VehicleNumberPlatePhotoURL}
                                text="Plate"
                              />
                              <DocumentBadge
                                available={rider.VehicleImageURL}
                                text="Image"
                              />
                            </div>
                          </td>

                          {/* Insurance */}
                          <td className="p-6">
                            <div className={`flex items-center gap-2 mb-2 font-medium ${
                              rider.INSURANCE_EXPIRY_DATE &&
                              new Date(rider.INSURANCE_EXPIRY_DATE) < new Date()
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}>
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(rider.INSURANCE_EXPIRY_DATE)}</span>
                              {rider.INSURANCE_EXPIRY_DATE &&
                               new Date(rider.INSURANCE_EXPIRY_DATE) < new Date() && (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <DocumentBadge
                                available={rider.INSURANCE_IMAGE}
                                text="Insurance"
                              />
                              <DocumentBadge
                                available={rider.RC_IMAGE}
                                text="RC"
                              />
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="p-6">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-sm text-gray-700">
                                  Join: <span className="font-medium">{formatDate(rider.AddedOn)}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                                <span className="text-sm text-gray-700">
                                  Leave: <span className="font-medium">{formatDate(rider.DateOfLeaving)}</span>
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-6">
                            <div className="flex flex-col gap-3">
                              {getStatusBadge(rider.Status)}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveToggle(rider.RiderId, rider.Status);
                                }}
                                disabled={updatingId === rider.RiderId}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getActionButtonColor(
                                  rider.Status
                                )}`}
                              >
                                {updatingId === rider.RiderId
                                  ? "Updating..."
                                  : getStatusActionText(rider.Status)}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {filteredRiders.map((rider, index) => (
                <div
                  key={rider.RiderId}
                  className="bg-white rounded-xl border border-gray-200 shadow-lg p-5"
                  onClick={() => {
                    localStorage.setItem("selectedRider", JSON.stringify(rider));
                    router.push(`/riders/${rider.RiderId}`);
                  }}
                >
                  {/* Header Section */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-gray-50 rounded-lg">
                          <User className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        <span className="font-bold text-gray-900">{rider.Name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-500" />
                        <span className="text-sm text-gray-600">{rider.PhoneNumber}</span>
                      </div>
                    </div>
                    {getStatusBadge(rider.Status)}
                  </div>

                  {/* Rider Info */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1 font-medium">Aadhar Number</div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Hash className="w-3 h-3" />
                      <span className="font-mono">{rider.AadharCardNumber}</span>
                    </div>
                  </div>

                  {/* Documents Grid */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Documents Status</div>
                    <div className="grid grid-cols-2 gap-2">
                      <DocumentBadge available={rider.AadharCardFrontURL} text="Aadhar" />
                      <DocumentBadge available={rider.VehicleNumberPlatePhotoURL} text="Plate" />
                      <DocumentBadge available={rider.VehicleImageURL} text="Vehicle" />
                      <DocumentBadge available={rider.INSURANCE_IMAGE} text="Insurance" />
                      <DocumentBadge available={rider.RC_IMAGE} text="RC" />
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1 font-medium">Vehicle</div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <CarIcon className="w-4 h-4" />
                      <span>{rider.VehicleNumber}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Join Date</div>
                      <div className="text-sm font-medium text-gray-900">{formatDate(rider.AddedOn)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Leave Date</div>
                      <div className="text-sm font-medium text-gray-900">{formatDate(rider.DateOfLeaving)}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveToggle(rider.RiderId, rider.Status);
                      }}
                      disabled={updatingId === rider.RiderId}
                      className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${getActionButtonColor(
                        rider.Status
                      )}`}
                    >
                      {updatingId === rider.RiderId
                        ? "Updating..."
                        : getStatusActionText(rider.Status)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && filteredRiders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No riders found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              {searchQuery || statusFilter !== "all" || documentFilter !== "all"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "No riders have been registered yet."}
            </p>
            {(searchQuery || statusFilter !== "all" || documentFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDocumentFilter("all");
                }}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
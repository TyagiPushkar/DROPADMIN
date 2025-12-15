"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../page";
import {
  User,
  Phone,
  Hash,
  Car,
  Bike,
  Calendar,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  FileCheck,
  FileWarning,
  AlertCircle,
  Check,
  X,
  ShieldCheck,
  Clock,
  TrendingUp,
  RefreshCw,
  Download,
  Eye,
  MoreVertical,
  FileText,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

// Professional Status Badge Component
const StatusBadge = ({ status, size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const statusConfig = {
    Approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
    },
    Rejected: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: XCircle,
      iconColor: "text-rose-600",
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: Clock,
      iconColor: "text-amber-600",
    },
    default: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: Clock,
      iconColor: "text-gray-600",
    },
  };

  const config = statusConfig[status] || statusConfig.default;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} ${config.bg} ${config.text} ${config.border} border rounded-full font-semibold`}
    >
      <Icon className={`w-4 h-4 ${config.iconColor}`} />
      <span>{status || "Pending"}</span>
    </div>
  );
};

// Professional Document Status Component
const DocumentStatus = ({ rider }) => {
  const documents = [
    { key: "AadharCardFrontURL", label: "Aadhar", required: true },
    { key: "VehicleImageURL", label: "Vehicle", required: true },
    {
      key: "VehicleNumberPlatePhotoURL",
      label: "Number Plate",
      required: true,
    },
    { key: "RC_IMAGE", label: "RC", required: true },
    { key: "INSURANCE_IMAGE", label: "Insurance", required: true },
  ];

  const completeCount = documents.filter((doc) => rider[doc.key]).length;
  const isComplete = completeCount === documents.length;
  const isExpired =
    rider.INSURANCE_EXPIRY_DATE &&
    new Date(rider.INSURANCE_EXPIRY_DATE) < new Date();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Documents</span>
        <span
          className={`text-xs font-semibold ${
            isComplete ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {completeCount}/{documents.length}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="relative group"
            title={`${doc.label}: ${rider[doc.key] ? "Uploaded" : "Missing"}`}
          >
            <div
              className={`w-6 h-6 rounded flex items-center justify-center ${
                rider[doc.key] ? "bg-emerald-100" : "bg-gray-100"
              }`}
            >
              {rider[doc.key] ? (
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <FileWarning className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {doc.label}: {rider[doc.key] ? "✓" : "✗"}
            </div>
          </div>
        ))}
      </div>
      {isExpired && (
        <div className="flex items-center gap-1 text-xs text-rose-600">
          <AlertCircle className="w-3 h-3" />
          <span>Insurance expired</span>
        </div>
      )}
    </div>
  );
};

// Professional Stats Card Component
const StatsCard = ({ icon: Icon, label, value, trend, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    rose: "bg-rose-50 text-rose-600 border-rose-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-600 mt-1">{label}</div>
        </div>
        <div className="p-2 rounded-lg bg-white/50">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

// Main Riders Component
export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRiders, setSelectedRiders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);
  const itemsPerPage = 10;
  const router = useRouter();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [documentFilter, setDocumentFilter] = useState("all");

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const response = await fetch(BASE_URL + "rider/get_all_rider.php");
      const data = await response.json();
      setRiders(data.data || []);
    } catch (error) {
      console.error("Error fetching riders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter riders
  const filteredRiders = riders.filter((rider) => {
    const matchesSearch =
      searchQuery === "" ||
      rider.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.PhoneNumber?.includes(searchQuery) ||
      rider.AadharCardNumber?.includes(searchQuery) ||
      rider.VehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && rider.Status === "Approved") ||
      (statusFilter === "pending" && (!rider.Status || rider.Status === "")) ||
      (statusFilter === "rejected" && rider.Status === "Rejected");

    let matchesDocument = true;
    if (documentFilter !== "all") {
      switch (documentFilter) {
        case "complete":
          matchesDocument =
            rider.AadharCardFrontURL &&
            rider.VehicleNumberPlatePhotoURL &&
            rider.VehicleImageURL &&
            rider.INSURANCE_IMAGE &&
            rider.RC_IMAGE;
          break;
        case "incomplete":
          matchesDocument =
            !rider.AadharCardFrontURL ||
            !rider.VehicleNumberPlatePhotoURL ||
            !rider.VehicleImageURL ||
            !rider.INSURANCE_IMAGE ||
            !rider.RC_IMAGE;
          break;
        case "expired":
          matchesDocument =
            rider.INSURANCE_EXPIRY_DATE &&
            new Date(rider.INSURANCE_EXPIRY_DATE) < new Date();
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDocument;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRiders = filteredRiders.slice(startIndex, endIndex);

  const handleApproveToggle = async (riderId, currentStatus) => {
    try {
      setUpdatingId(riderId);
      const newStatus = currentStatus === "Approved" ? "Rejected" : "Approved";

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
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedRiders.length === paginatedRiders.length) {
      setSelectedRiders([]);
    } else {
      setSelectedRiders(paginatedRiders.map((r) => r.RiderId));
    }
  };

  const handleSelectRider = (riderId) => {
    setSelectedRiders((prev) =>
      prev.includes(riderId)
        ? prev.filter((id) => id !== riderId)
        : [...prev, riderId]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedRiders.length === 0) return;

    try {
      setUpdatingId("bulk");
      for (const riderId of selectedRiders) {
        await fetch(BASE_URL + "rider/update_rider_status.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ RiderId: riderId, Status: "Approved" }),
        });
      }

      // Refresh riders data
      await fetchRiders();
      setSelectedRiders([]);
    } catch (error) {
      console.error("Error in bulk approve:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkReject = async () => {
    if (selectedRiders.length === 0) return;

    try {
      setUpdatingId("bulk");
      for (const riderId of selectedRiders) {
        await fetch(BASE_URL + "rider/update_rider_status.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ RiderId: riderId, Status: "Rejected" }),
        });
      }

      // Refresh riders data
      await fetchRiders();
      setSelectedRiders([]);
    } catch (error) {
      console.error("Error in bulk reject:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      // Create CSV content
      const headers = [
        "ID",
        "Name",
        "Phone",
        "Vehicle",
        "Aadhar",
        "Status",
        "Insurance Expiry",
        "Documents Complete",
      ];
      const rows = riders.map((rider) => [
        rider.RiderId,
        `"${rider.Name || ""}"`,
        rider.PhoneNumber,
        rider.VehicleNumber,
        rider.AadharCardNumber,
        rider.Status || "Pending",
        rider.INSURANCE_EXPIRY_DATE || "N/A",
        rider.AadharCardFrontURL &&
        rider.VehicleNumberPlatePhotoURL &&
        rider.VehicleImageURL &&
        rider.INSURANCE_IMAGE &&
        rider.RC_IMAGE
          ? "Yes"
          : "No",
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `riders_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const expiredInsuranceCount = riders.filter(
      (r) => r.INSURANCE_EXPIRY_DATE && new Date(r.INSURANCE_EXPIRY_DATE) < now
    ).length;

    return {
      total: riders.length,
      approved: riders.filter((r) => r.Status === "Approved").length,
      pending: riders.filter((r) => !r.Status || r.Status === "").length,
      rejected: riders.filter((r) => r.Status === "Rejected").length,
      completeDocs: riders.filter(
        (r) =>
          r.AadharCardFrontURL &&
          r.VehicleNumberPlatePhotoURL &&
          r.VehicleImageURL &&
          r.INSURANCE_IMAGE &&
          r.RC_IMAGE
      ).length,
      expiredInsurance: expiredInsuranceCount,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Rider Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor all registered riders in your system
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRiders}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleExport}
                disabled={exportLoading || riders.length === 0}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Export Data"
              >
                {exportLoading ? (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => router.push("/add-rider")}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Rider</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <StatsCard
              icon={Users}
              label="Total Riders"
              value={stats.total}
              color="blue"
            />
            <StatsCard
              icon={CheckCircle}
              label="Approved"
              value={stats.approved}
              color="emerald"
            />
            <StatsCard
              icon={Clock}
              label="Pending"
              value={stats.pending}
              color="amber"
            />
            <StatsCard
              icon={XCircle}
              label="Rejected"
              value={stats.rejected}
              color="rose"
            />
            <StatsCard
              icon={ShieldCheck}
              label="Complete Docs"
              value={stats.completeDocs}
              color="purple"
            />
            <StatsCard
              icon={AlertCircle}
              label="Expired Insurance"
              value={stats.expiredInsurance}
              color="rose"
            />
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search riders by name, phone, vehicle, or Aadhar..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={documentFilter}
                  onChange={(e) => setDocumentFilter(e.target.value)}
                >
                  <option value="all">All Documents</option>
                  <option value="complete">Complete</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="expired">Insurance Expired</option>
                </select>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setDocumentFilter("all");
                    setCurrentPage(1);
                  }}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Actions */}
        {selectedRiders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-900">
                    {selectedRiders.length} riders selected
                  </div>
                  <div className="text-sm text-blue-700">
                    Bulk actions available
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkApprove}
                  disabled={updatingId === "bulk"}
                  className="px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  {updatingId === "bulk" ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "Approve All"
                  )}
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={updatingId === "bulk"}
                  className="px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setSelectedRiders([])}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Professional Table */}
        {loading ? (
          <div className="flex items-center justify-center h-96 bg-white rounded-xl border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-gray-600">Loading riders data...</div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {filteredRiders.length > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          selectedRiders.length === paginatedRiders.length &&
                          paginatedRiders.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Select All
                      </span>
                    </label>
                  )}
                  <div className="text-sm text-gray-500">
                    {filteredRiders.length} riders found • Page {currentPage} of{" "}
                    {totalPages}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExport}
                    disabled={exportLoading || filteredRiders.length === 0}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Export Results"
                  >
                    {exportLoading ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Rider Details
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Documents
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Vehicle Details
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRiders.map((rider) => (
                    <tr
                      key={rider.RiderId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedRiders.includes(rider.RiderId)}
                              onChange={() => handleSelectRider(rider.RiderId)}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </label>
                          <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => {
                              localStorage.setItem(
                                "selectedRider",
                                JSON.stringify(rider)
                              );
                              router.push(`/riders/${rider.RiderId}`);
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                              <img src={rider.ProfilePictureURL} className="w-10 h-10" style={{borderRadius:"50%"}} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {rider.Name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <Phone className="w-3 h-3" />
                                {rider.PhoneNumber}
                              </div>
                            
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <DocumentStatus rider={rider} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Bike className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">
                              {rider.VehicleNumber}
                            </span>
                          </div>
                         
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={rider.Status} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem(
                                "selectedRider",
                                JSON.stringify(rider)
                              );
                              router.push(`/riders/${rider.RiderId}`);
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {rider.Status !== "Approved" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveToggle(
                                  rider.RiderId,
                                  rider.Status
                                );
                              }}
                              disabled={updatingId === rider.RiderId}
                              className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              {updatingId === rider.RiderId ? (
                                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          {rider.Status !== "Rejected" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveToggle(
                                  rider.RiderId,
                                  rider.Status
                                );
                              }}
                              disabled={updatingId === rider.RiderId}
                              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              {updatingId === rider.RiderId ? (
                                <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <button
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="More Options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredRiders.length === 0 && (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No riders found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  documentFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No riders have been registered yet"}
                </p>
                {(searchQuery ||
                  statusFilter !== "all" ||
                  documentFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setDocumentFilter("all");
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Table Footer with Pagination */}
            {filteredRiders.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredRiders.length)} of{" "}
                    {filteredRiders.length} riders
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Footer */}
        {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
            onClick={() => router.push("/riders/new")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Add New Rider
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Register a new rider
                </div>
              </div>
              <Plus className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div
            className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all"
            onClick={handleExport}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Export Data
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Download CSV/Excel
                </div>
              </div>
              <Download className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Recent Activity
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  View audit logs
                </div>
              </div>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

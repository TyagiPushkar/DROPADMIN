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
  Menu,
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
      className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} ${config.bg} ${config.text} ${config.border} border rounded-full font-semibold whitespace-nowrap`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
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
      <div className="flex flex-wrap gap-1">
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
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {doc.label}: {rider[doc.key] ? "✓" : "✗"}
            </div>
          </div>
        ))}
      </div>
      {isExpired && (
        <div className="flex items-center gap-1 text-xs text-rose-600">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">Insurance expired</span>
        </div>
      )}
    </div>
  );
};

// Professional Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    rose: "bg-rose-50 text-rose-600 border-rose-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <div className={`p-3 sm:p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-xl sm:text-2xl font-bold truncate">{value}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{label}</div>
        </div>
        <div className="p-1.5 sm:p-2 rounded-lg bg-white/50 flex-shrink-0">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
};

// Mobile Filter Drawer Component
const MobileFilterDrawer = ({ isOpen, onClose, statusFilter, setStatusFilter, searchTerm, setSearchTerm, documentFilter, setDocumentFilter }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search drivers..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Document Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Documents
            </label>
            <select
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={documentFilter}
              onChange={(e) => {
                setDocumentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Documents</option>
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
              <option value="expired">Expired Insurance</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || statusFilter !== "all" || documentFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDocumentFilter("all");
                onClose();
              }}
              className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const itemsPerPage = 10;
  const router = useRouter();

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [documentFilter, setDocumentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
    // Handle status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && rider.Status === "Approved") ||
      (statusFilter === "pending" &&
        (!rider.Status ||
          rider.Status === "" ||
          rider.Status.toLowerCase() === "pending")) ||
      (statusFilter === "rejected" && rider.Status === "Rejected");

    // Handle document filter
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

    // Handle search by name
    const matchesSearch = searchTerm === "" || 
      (rider.Name && rider.Name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesDocument && matchesSearch;
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
      const headers = ["ID", "Name", "Phone", "Vehicle Number", "Status"];

      const rows = paginatedRiders.map((rider) => [
        rider.RiderId,
        `"${rider.Name || ""}"`,
        rider.PhoneNumber || "",
        rider.VehicleNumber || "",
        rider.Status || "Pending",
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `riders_page_${currentPage}_${
        new Date().toISOString().split("T")[0]
      }.csv`;
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

    const pendingCount = riders.filter(
      (r) =>
        !r.Status || r.Status === "" || r.Status.toLowerCase() === "pending"
    ).length;

    return {
      total: riders.length,
      approved: riders.filter((r) => r.Status === "Approved").length,
      pending: pendingCount,
      rejected: riders.filter((r) => r.Status === "Rejected").length,
      completeDocs: riders.filter(
        (r) =>
          r.AadharCardFrontURL &&
          r.VehicleNumberPlatePhotoURL &&
          r.VehicleImageURL &&
          r.INSURANCE_IMAGE &&
          r.RC_IMAGE
      ).length,
      expiredInsurance: riders.filter(
        (r) =>
          r.INSURANCE_EXPIRY_DATE && new Date(r.INSURANCE_EXPIRY_DATE) < now
      ).length,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          documentFilter={documentFilter}
          setDocumentFilter={setDocumentFilter}
        />

        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Driver Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Manage and monitor all registered drivers in your system
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={fetchRiders}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleExport}
                disabled={exportLoading || riders.length === 0}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Export Current Page"
              >
                {exportLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <button
                onClick={() => router.push("/add-rider")}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Add Driver</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4">
            <StatsCard
              icon={Users}
              label="Total"
              value={stats.total}
              color="blue"
            />
            <StatsCard
              icon={CheckCircle}
              label="Active"
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
          </div>

          {/* Filters - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search drivers..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(searchTerm || statusFilter !== "all" || documentFilter !== "all") && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
            
            {/* Quick Status Filter for Mobile */}
            <select
              className="flex-1 px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Professional Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64 sm:h-96 bg-white rounded-xl border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-sm sm:text-base text-gray-600">Loading drivers data...</div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
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
                      <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                        Select All
                      </span>
                    </label>
                  )}
                  <div className="text-xs sm:text-sm text-gray-500">
                    <span className="hidden xs:inline">{filteredRiders.length} drivers found</span>
                    <span className="xs:hidden">{filteredRiders.length} found</span>
                    <span className="mx-1">•</span>
                    <span>Page {currentPage}/{totalPages}</span>
                  </div>
                </div>
                
                {/* Bulk Actions */}
                {selectedRiders.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkApprove}
                      disabled={updatingId === "bulk"}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Approve</span>
                      <span className="xs:hidden">✓</span>
                    </button>
                    <button
                      onClick={handleBulkReject}
                      disabled={updatingId === "bulk"}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Reject</span>
                      <span className="xs:hidden">✗</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Table Body - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 lg:px-6 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Driver
                      </span>
                    </th>
                    <th className="py-3 px-4 lg:px-6 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Contact
                      </span>
                    </th>
                    <th className="py-3 px-4 lg:px-6 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Vehicle
                      </span>
                    </th>
                    <th className="py-3 px-4 lg:px-6 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
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
                      <td className="py-3 px-4 lg:px-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedRiders.includes(rider.RiderId)}
                            onChange={() => handleSelectRider(rider.RiderId)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div
                            className="flex items-center gap-2 cursor-pointer min-w-0"
                            onClick={() => {
                              localStorage.setItem(
                                "selectedRider",
                                JSON.stringify(rider)
                              );
                              router.push(`/riders/${rider.RiderId}`);
                            }}
                          >
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex-shrink-0 overflow-hidden">
                              <img
                                src={rider.ProfilePictureURL || "/default-avatar.png"}
                                className="w-full h-full object-cover"
                                alt={rider.Name}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm lg:text-base text-gray-900 truncate">
                                {rider.Name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 lg:px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{rider.PhoneNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 lg:px-6">
                        <div className="flex items-center gap-2">
                          <Bike className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="font-medium text-sm lg:text-base text-gray-900 truncate">
                            {rider.VehicleNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 lg:px-6">
                        <StatusBadge status={rider.Status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {paginatedRiders.map((rider) => (
                <div key={rider.RiderId} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedRiders.includes(rider.RiderId)}
                      onChange={() => handleSelectRider(rider.RiderId)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div
                      className="flex-1 flex items-center gap-3 cursor-pointer min-w-0"
                      onClick={() => {
                        localStorage.setItem(
                          "selectedRider",
                          JSON.stringify(rider)
                        );
                        router.push(`/riders/${rider.RiderId}`);
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex-shrink-0 overflow-hidden">
                        <img
                          src={rider.ProfilePictureURL || "/default-avatar.png"}
                          className="w-full h-full object-cover"
                          alt={rider.Name}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 truncate">
                          {rider.Name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{rider.PhoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-9 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">
                        {rider.VehicleNumber}
                      </span>
                    </div>
                    <StatusBadge status={rider.Status} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredRiders.length === 0 && (
              <div className="py-12 sm:py-16 text-center px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No drivers found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all" || documentFilter !== "all"
                    ? "Try adjusting your filters"
                    : "No drivers have been registered yet"}
                </p>
                {(searchTerm || statusFilter !== "all" || documentFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setDocumentFilter("all");
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Table Footer with Pagination */}
            {filteredRiders.length > 0 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
                  <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredRiders.length)} of {filteredRiders.length}
                  </div>
                  
                  {/* Mobile Pagination */}
                  <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {/* Page Numbers - Hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-1">
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
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Mobile Page Indicator */}
                    <span className="sm:hidden text-sm font-medium">
                      {currentPage}/{totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
      </div>
    </div>
  );
}
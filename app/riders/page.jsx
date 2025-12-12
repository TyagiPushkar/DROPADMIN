"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../page";
import {
  User,
  Phone,
  Hash,
  Car,
  Calendar,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  FileCheck,
  FileWarning,
  AlertCircle,
  Mail,
  Check,
  X,
  FileText,
  Shield,
  ChevronRight
} from "lucide-react";

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    const matchesSearch = searchQuery === "" ||
      (rider.Name && rider.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rider.PhoneNumber && rider.PhoneNumber.includes(searchQuery)) ||
      (rider.AadharCardNumber && rider.AadharCardNumber.includes(searchQuery)) ||
      (rider.VehicleNumber && rider.VehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" ||
      rider.Status === statusFilter ||
      (statusFilter === "pending" && (!rider.Status || rider.Status === "")) ||
      (statusFilter === "approved" && rider.Status === "Approved") ||
      (statusFilter === "rejected" && rider.Status === "Rejected");

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

    return matchesSearch && matchesStatus && matchesDocument;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "Approved") return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" />
        Approved
      </span>
    );
    if (status === "Rejected") return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3.5 h-3.5" />
        Rejected
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
        Pending
      </span>
    );
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

  const DocumentIcon = ({ available }) => (
    available ? (
      <div className="p-1 rounded bg-emerald-50">
        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
      </div>
    ) : (
      <div className="p-1 rounded bg-gray-100">
        <FileWarning className="w-3.5 h-3.5 text-gray-400" />
      </div>
    )
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-2">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rider Management</h1>
              <p className="text-gray-600 mt-1">Manage rider profiles and approvals</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredRiders.length} riders
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-blue-50">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-emerald-50">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-700">{stats.approved}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-amber-50">
                  <div className="w-5 h-5 rounded-full bg-amber-500 animate-pulse"></div>
                </div>
                <div>
                  <div className="text-xl font-bold text-amber-700">{stats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-rose-50">
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-rose-700">{stats.rejected}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-emerald-50">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.documentsComplete}</div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-rose-50">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-rose-700">{stats.insuranceExpired}</div>
                  <div className="text-sm text-gray-600">Expired</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search riders..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="px-3 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  className="px-3 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={documentFilter}
                  onChange={(e) => setDocumentFilter(e.target.value)}
                >
                  <option value="all">All Docs</option>
                  <option value="complete">Complete</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="expired">Expired</option>
                </select>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setDocumentFilter("all");
                  }}
                  className="px-3 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded border border-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded border">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="hidden lg:block">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-900 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Riders List</h3>
                    <div className="text-xs text-gray-300">
                      {filteredRiders.length} records
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Rider Details
                        </th>
                        <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Documents
                        </th>
                        <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Vehicle & Insurance
                        </th>
                        <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredRiders.map((rider) => (
                        <tr
                          key={rider.RiderId}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={(e) => {
                            if (!e.target.closest('button')) {
                              localStorage.setItem("selectedRider", JSON.stringify(rider));
                              router.push(`/riders/${rider.RiderId}`);
                            }
                          }}
                        >
                          {/* Rider Details */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{rider.Name}</div>
                                <div className="text-sm text-gray-500 mt-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5" />
                                    {rider.PhoneNumber}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Documents */}
                          <td className="p-4">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <DocumentIcon available={rider.AadharCardFrontURL} />
                                <span className="text-xs font-medium text-gray-700">Aadhar</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DocumentIcon available={rider.RC_IMAGE} />
                                <span className="text-xs font-medium text-gray-700">RC</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DocumentIcon available={rider.VehicleImageURL} />
                                <span className="text-xs font-medium text-gray-700">Vehicle</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DocumentIcon available={rider.INSURANCE_IMAGE} />
                                <span className="text-xs font-medium text-gray-700">Insurance</span>
                              </div>
                            </div>
                          </td>

                          {/* Vehicle & Insurance */}
                          <td className="p-4">
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Car className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium text-gray-900">{rider.VehicleNumber}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Aadhar: {rider.AadharCardNumber}
                                </div>
                              </div>
                              <div className={`flex items-center gap-2 ${
                                rider.INSURANCE_EXPIRY_DATE &&
                                new Date(rider.INSURANCE_EXPIRY_DATE) < new Date()
                                  ? "text-rose-600"
                                  : "text-gray-700"
                              }`}>
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Ins: {formatDate(rider.INSURANCE_EXPIRY_DATE)}</span>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {getStatusBadge(rider.Status)}
                          </td>

                          {/* Actions - Tick/Cross Only */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {rider.Status !== "Approved" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveToggle(rider.RiderId, rider.Status);
                                  }}
                                  disabled={updatingId === rider.RiderId}
                                  className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
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
                                    handleApproveToggle(rider.RiderId, rider.Status);
                                  }}
                                  disabled={updatingId === rider.RiderId}
                                  className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                                  title="Reject"
                                >
                                  {updatingId === rider.RiderId ? (
                                    <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <X className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {filteredRiders.map((rider) => (
                <div
                  key={rider.RiderId}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                  onClick={() => {
                    localStorage.setItem("selectedRider", JSON.stringify(rider));
                    router.push(`/riders/${rider.RiderId}`);
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{rider.Name}</div>
                        <div className="text-sm text-gray-500">ID: {rider.RiderId}</div>
                      </div>
                    </div>
                    {getStatusBadge(rider.Status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Phone</div>
                      <div className="text-sm font-medium flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {rider.PhoneNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Vehicle</div>
                      <div className="text-sm font-medium flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" />
                        {rider.VehicleNumber}
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-2">Documents</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <DocumentIcon available={rider.AadharCardFrontURL} />
                        <span className="text-sm">Aadhar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentIcon available={rider.VehicleImageURL} />
                        <span className="text-sm">Vehicle</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentIcon available={rider.RC_IMAGE} />
                        <span className="text-sm">RC</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentIcon available={rider.INSURANCE_IMAGE} />
                        <span className="text-sm">Insurance</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className={`flex items-center gap-1.5 text-sm ${
                      rider.INSURANCE_EXPIRY_DATE &&
                      new Date(rider.INSURANCE_EXPIRY_DATE) < new Date()
                        ? "text-rose-600"
                        : "text-gray-600"
                    }`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Ins: {formatDate(rider.INSURANCE_EXPIRY_DATE)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {rider.Status !== "Approved" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveToggle(rider.RiderId, rider.Status);
                          }}
                          disabled={updatingId === rider.RiderId}
                          className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded border border-emerald-200"
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
                            handleApproveToggle(rider.RiderId, rider.Status);
                          }}
                          disabled={updatingId === rider.RiderId}
                          className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded border border-rose-200"
                          title="Reject"
                        >
                          {updatingId === rider.RiderId ? (
                            <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && filteredRiders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">No riders found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery || statusFilter !== "all" || documentFilter !== "all"
                ? "Try adjusting your filters"
                : "No riders registered"}
            </p>
            {(searchQuery || statusFilter !== "all" || documentFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDocumentFilter("all");
                }}
                className="px-4 py-2 text-sm bg-gray-900 text-white font-medium rounded hover:bg-gray-800"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
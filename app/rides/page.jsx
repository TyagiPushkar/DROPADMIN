"use client";
import { useState, useEffect, useMemo } from "react";
import { BASE_URL } from "../page";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  X,
  IndianRupee,
  Navigation,
  Timer,
  Hash,
  ChevronRight,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Loader2,
  TrendingDown,
  ChevronDown,
  BarChart3,
  Wallet,
  ShoppingCart,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import dynamic from "next/dynamic";

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalRides: 0,
    totalRevenue: 0,
    completedRides: 0,
    activeRides: 0
  });

  const RideRouteMap = dynamic(() => import("@/components/RideRouteMap"), {
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    ),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ridesRes, ridersRes] = await Promise.all([
          fetch(BASE_URL + "rides/get_all_rides.php"),
          fetch(BASE_URL + "rider/get_all_rider.php")
        ]);
        
        const ridesData = await ridesRes.json();
        const ridersData = await ridersRes.json();
        
        const ridesArray = ridesData.data || [];
        setRides(ridesArray);
        setRiders(ridersData.data || []);
        
        // Calculate statistics
        const totalRevenue = ridesArray.reduce((sum, ride) => sum + (parseFloat(ride.fare) || 0), 0);
        const completedRides = ridesArray.filter(ride => ride.completed_at).length;
        const activeRides = ridesArray.length - completedRides;
        
        setStats({
          totalRides: ridesArray.length,
          totalRevenue,
          completedRides,
          activeRides
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getRiderDetails = (riderId) => {
    if (!riderId) return null;
    return riders.find((r) => r.RiderId == riderId) || {};
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "—";
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateRideDuration = (start, end) => {
    if (!start || !end) return "—";
    try {
      const startTime = new Date(start);
      const endTime = new Date(end);
      const diffMs = endTime - startTime;
      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
      }
      return `${minutes}m`;
    } catch (e) {
      return "—";
    }
  };

  const openInMaps = (lat, lng) => {
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const filteredRides = useMemo(() => {
    return rides.filter(ride => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const rider = getRiderDetails(ride.rider_id);
        const matchesSearch = 
          ride.pickup_location?.toLowerCase().includes(query) ||
          ride.drop_location?.toLowerCase().includes(query) ||
          rider?.PhoneNumber?.includes(query) ||
          rider?.AadharCardNumber?.includes(query) ||
          ride.ride_id?.toString().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        const isCompleted = !!ride.completed_at;
        if (statusFilter === "completed" && !isCompleted) return false;
        if (statusFilter === "active" && isCompleted) return false;
      }

      // Date filter
      if (dateRange.start || dateRange.end) {
        const rideDate = new Date(ride.created_at);
        if (dateRange.start && rideDate < new Date(dateRange.start)) return false;
        if (dateRange.end) {
          const endDate = new Date(dateRange.end);
          endDate.setHours(23, 59, 59, 999);
          if (rideDate > endDate) return false;
        }
      }

      return true;
    });
  }, [rides, searchQuery, statusFilter, dateRange]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRides.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRides = filteredRides.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateRange]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table
    document.getElementById('rides-table-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateRange({ start: "", end: "" });
  };

  const StatusBadge = ({ isCompleted }) => {
    if (isCompleted) return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        Completed
      </span>
    );
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
        In Progress
      </span>
    );
  };

  const handleRowClick = (ride) => {
    const rider = getRiderDetails(ride.rider_id);
    setSelectedRide({ ...ride, rider });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="mx-2">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ride Management</h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">Monitor, track, and analyze all ride activities</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Rides</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRides}</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center">
                      <IndianRupee className="w-5 h-5 mr-1" />
                      {stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedRides}</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Active Rides</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeRides}</p>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, rider phone, Aadhar, or ride ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="active">Active</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  value={dateRange.start || "all"}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value === "all" ? "" : e.target.value })}
                >
                  <option value="all">All Time</option>
                  <option value="">Custom Date</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              {(searchQuery || statusFilter !== "all" || dateRange.start || dateRange.end) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{Math.min(filteredRides.length, rowsPerPage)}</span> of <span className="font-semibold">{filteredRides.length}</span> rides
              {filteredRides.length !== rides.length && (
                <span className="text-gray-400 ml-1">(filtered from {rides.length} total)</span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Updated just now
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading ride data...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching real-time ride information</p>
          </div>
        ) : (
          <>
            <div id="rides-table-container" className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-900 to-gray-800">
                      <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Hash className="w-4 h-4" />
                          </div>
                          <span>Ride Details</span>
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
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span>Route</span>
                        </div>
                      </th>
                      <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Clock className="w-4 h-4" />
                          </div>
                          <span>Timings</span>
                        </div>
                      </th>
                      <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Timer className="w-4 h-4" />
                          </div>
                          <span>Duration</span>
                        </div>
                      </th>
                      <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <IndianRupee className="w-4 h-4" />
                          </div>
                          <span>Fare</span>
                        </div>
                      </th>
                      <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span>Status</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedRides.map((ride) => {
                      const rider = getRiderDetails(ride.rider_id);
                      const rideDuration = calculateRideDuration(ride.started_at, ride.completed_at);
                      const isCompleted = !!ride.completed_at;
                      
                      return (
                        <tr 
                          key={ride.ride_id}
                          onClick={() => handleRowClick(ride)}
                          className="hover:bg-gray-50/80 transition-colors duration-150 group cursor-pointer hover:shadow-sm"
                        >
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-150">
                                <Hash className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">Ride #{ride.ride_id}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                  <CalendarDays className="w-3.5 h-3.5" />
                                  {formatDate(ride.created_at)}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="p-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-150">
                                  <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="font-medium text-sm">{rider?.Name || "Unknown"}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-150">
                                  <Phone className="w-4 h-4" />
                                </div>
                                {rider?.PhoneNumber || "—"}
                              </div>
                            </div>
                          </td>
                          
                          <td className="p-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-150">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs text-gray-500">From</div>
                                  <div className="font-medium text-sm truncate max-w-[120px]">{ride.pickup_location}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-150">
                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs text-gray-500">To</div>
                                  <div className="font-medium text-sm truncate max-w-[120px]">{ride.drop_location}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="p-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-150">
                                  <Clock className="w-4 h-4 text-green-500" />
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Start</div>
                                  <div className="font-medium text-sm">{formatTime(ride.started_at)}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-150">
                                  <Clock className="w-4 h-4 text-red-500" />
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">End</div>
                                  <div className="font-medium text-sm">{formatTime(ride.completed_at)}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-150">
                                <Timer className="w-4 h-4 text-orange-500" />
                              </div>
                              <span className="font-bold text-orange-700">{rideDuration}</span>
                            </div>
                          </td>
                          
                          <td className="p-6">
                            <div className="flex items-center gap-3 font-bold text-green-700">
                              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-150">
                                <IndianRupee className="w-4 h-4" />
                              </div>
                              <span className="text-lg">{ride.fare || "0"}</span>
                            </div>
                          </td>
                          
                          <td className="p-6">
                            <StatusBadge isCompleted={isCompleted} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {filteredRides.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Navigation className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                      {searchQuery || statusFilter !== "all" || dateRange.start || dateRange.end
                        ? "Try adjusting your search or filter to find what you're looking for."
                        : "When rides are completed, they will appear here."}
                    </p>
                    {(searchQuery || statusFilter !== "all" || dateRange.start || dateRange.end) && (
                      <button 
                        onClick={clearFilters}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {filteredRides.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600 ml-2">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredRides.length)} of {filteredRides.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    } transition-colors duration-200`}
                    title="First page"
                  >
                    <ChevronsLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    } transition-colors duration-200`}
                    title="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    } transition-colors duration-200`}
                    title="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    } transition-colors duration-200`}
                    title="Last page"
                  >
                    <ChevronsRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal - Enhanced */}
      {selectedRide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedRide(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Ride Details</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {formatDate(selectedRide.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      ID: {selectedRide.ride_id}
                    </div>
                    <StatusBadge isCompleted={!!selectedRide.completed_at} />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRide(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">Total Fare</div>
                  <div className="text-2xl font-bold text-blue-900 flex items-center">
                    <IndianRupee className="w-6 h-6" />
                    {selectedRide.fare || "0"}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                  <div className="text-sm text-green-700 mb-1">Duration</div>
                  <div className="text-2xl font-bold text-green-900 flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    {calculateRideDuration(selectedRide.started_at, selectedRide.completed_at)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                  <div className="text-sm text-purple-700 mb-1">Distance</div>
                  <div className="text-2xl font-bold text-purple-900 flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    {selectedRide.distance || "N/A"} km
                  </div>
                </div>
              </div>

              {/* Ride Route Map */}
              <div className="bg-gray-50 rounded-xl p-1">
                <RideRouteMap selectedRide={selectedRide} />
              </div>

              {/* Route Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Pickup Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Location</div>
                      <div 
                        className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer flex items-center gap-2"
                        onClick={() => openInMaps(selectedRide.pickup_lat, selectedRide.pickup_lng)}
                      >
                        {selectedRide.pickup_location}
                        <Navigation className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Time</div>
                      <div className="flex items-center gap-2 font-medium">
                        <Clock className="w-4 h-4 text-green-500" />
                        {formatTime(selectedRide.started_at)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    Drop Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Location</div>
                      <div 
                        className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer flex items-center gap-2"
                        onClick={() => openInMaps(selectedRide.drop_lat, selectedRide.drop_lng)}
                      >
                        {selectedRide.drop_location}
                        <Navigation className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Time</div>
                      <div className="flex items-center gap-2 font-medium">
                        <Clock className="w-4 h-4 text-red-500" />
                        {formatTime(selectedRide.completed_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rider Information */}
              {selectedRide.rider && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    Rider Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Full Name</div>
                      <div className="font-medium">{selectedRide.rider.Name || "—"}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Mobile Number</div>
                      <div className="font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {selectedRide.rider.PhoneNumber || "—"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Aadhar Number</div>
                      <div className="font-medium font-mono flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        {selectedRide.rider.AadharCardNumber || "—"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Rider ID</div>
                      <div className="font-medium bg-gray-100 px-3 py-1 rounded-lg inline-block">
                        #{selectedRide.rider.RiderId}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Print Details
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedRide(null)}
                    className="px-6 py-2.5 cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (selectedRide.pickup_lat && selectedRide.pickup_lng) {
                        openInMaps(selectedRide.pickup_lat, selectedRide.pickup_lng);
                      }
                    }}
                    className="px-6 py-2.5 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
                  >
                    View in Maps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
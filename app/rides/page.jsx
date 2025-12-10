"use client";
import { useState, useEffect } from "react";
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
  ChevronRight
} from "lucide-react";

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);

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
        
        setRides(ridesData.data || []);
        setRiders(ridersData.data || []);
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
  

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className=" mx-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Rides</h1>
          <p className="text-gray-600 mt-2">Complete ride history and details</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading ride data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Rider Info</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Route</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Timings</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Duration</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Fare</th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rides.map((ride) => {
                    const rider = getRiderDetails(ride.rider_id);
                    const rideDuration = calculateRideDuration(ride.started_at, ride.completed_at);
                    const isCompleted = !!ride.completed_at;
                    
                    return (
                      <tr 
                        key={ride.ride_id}
                        onClick={() => setSelectedRide({ ...ride, rider })}
                        className="hover:bg-gray-50/80 transition-colors duration-150 cursor-pointer group"
                      >
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{formatDate(ride.created_at)}</span>
                            </div>
                            <div className="text-xs text-gray-500">ID: {ride.ride_id}</div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="space-y-2">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Mobile</div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <span className="font-medium">{rider?.PhoneNumber || "—"}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Aadhar</div>
                              <div className="flex items-center gap-2">
                                <Hash className="w-3.5 h-3.5 text-gray-400" />
                                <span className="font-mono text-sm">{rider?.AadharCardNumber || "—"}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Pickup</div>
                                <div className="font-medium text-sm max-w-[140px] truncate">{ride.pickup_location}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Destination</div>
                                <div className="font-medium text-sm max-w-[140px] truncate">{ride.drop_location}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Start</div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-green-500" />
                                <span className="font-medium text-sm">{formatTime(ride.started_at)}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">End</div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-red-500" />
                                <span className="font-medium text-sm">{formatTime(ride.completed_at)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-orange-500" />
                            <span className="font-medium">{rideDuration}</span>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center gap-1 font-bold text-green-700">
                            <IndianRupee className="w-4 h-4" />
                            <span>{ride.fare || "0"}</span>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {isCompleted ? "Completed" : "In Progress"}
                          </div>
                          <ChevronRight className="w-4 h-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity inline" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {rides.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No rides found</div>
                  <p className="text-gray-500 text-sm">When rides are completed, they'll appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedRide(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedRide.completed_at ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <h2 className="text-2xl font-bold text-gray-900">Ride Details</h2>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {formatDate(selectedRide.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      ID: {selectedRide.ride_id}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRide(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-sm text-blue-700 mb-1">Total Fare</div>
                  <div className="text-2xl font-bold text-blue-900 flex items-center">
                    <IndianRupee className="w-6 h-6" />
                    {selectedRide.fare || "0"}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="text-sm text-green-700 mb-1">Duration</div>
                  <div className="text-2xl font-bold text-green-900 flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    {calculateRideDuration(selectedRide.started_at, selectedRide.completed_at)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="text-sm text-purple-700 mb-1">Status</div>
                  <div className={`text-lg font-bold ${
                    selectedRide.completed_at ? 'text-purple-900' : 'text-yellow-800'
                  }`}>
                    {selectedRide.completed_at ? "Completed" : "In Progress"}
                  </div>
                </div>
              </div>

              {/* Route Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  Route Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">Pickup Location</div>
                      <div 
  className="font-medium text-gray-900 underline cursor-pointer"
  onClick={() => openInMaps(selectedRide.pickup_lat, selectedRide.pickup_lng)}
>
  {selectedRide.pickup_location}
</div>

                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(selectedRide.started_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">Destination</div>
                      <div 
  className="font-medium text-gray-900 underline cursor-pointer"
  onClick={() => openInMaps(selectedRide.drop_lat, selectedRide.drop_lng)}
>
  {selectedRide.drop_location}
</div>

                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(selectedRide.completed_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rider Information */}
              {selectedRide.rider && (
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Rider Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Name</div>
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
                      <div className="font-medium">#{selectedRide.rider.RiderId}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedRide(null)}
                  className="px-6 py-3 cursor-pointer bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
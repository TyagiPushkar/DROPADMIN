"use client"

import { useState, useEffect } from "react"
import { Users, Search, Eye, MoreVertical, X, User, Mail, Phone, MapPin, Calendar, Shield, Car, FileText, IdCard, CheckCircle, Clock, XCircle } from "lucide-react"
import { BASE_URL } from "../page"

export default function RidersPage() {
  const [riders, setRiders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updatingId, setUpdatingId] = useState(null)
  const [selectedRider, setSelectedRider] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchRiders()
  }, [])

  const fetchRiders = async () => {
    try {
      setLoading(true)
      const response = await fetch(BASE_URL + 'rider/get_all_rider.php')
      const result = await response.json()
      
      if (result.success) {
        setRiders(result.data)
      } else {
        console.error("Error fetching riders:", result.message)
      }
    } catch (error) {
      console.error("Error fetching riders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveToggle = async (riderId, currentStatus) => {
    try {
      setUpdatingId(riderId)
      
      let newStatus
      if (currentStatus === "Approved") {
        newStatus = "Rejected"
      } else if (currentStatus === "Rejected") {
        newStatus = "Approved"
      } else {
        newStatus = "Approved" 
      }

      const response = await fetch(BASE_URL + 'rider/update_rider_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RiderId: riderId, Status: newStatus })
      })
      
      const result = await response.json()

      if (result.success) {
        setRiders(prevRiders =>
          prevRiders.map(rider =>
            rider.RiderId === riderId
              ? { ...rider, Status: newStatus }
              : rider
          )
        )
      } else {
        console.error("Error updating rider:", result.message)
        alert(`Failed to update rider: ${result.message}`)
      }
    } catch (error) {
      console.error("Error updating rider status:", error)
      alert("Failed to update rider status")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleViewDetails = (rider) => {
    setSelectedRider(rider)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedRider(null)
  }

  const getStatusActionText = (status) => {
    switch (status) {
      case "Approved": return "Reject"
      case "Rejected": return "Approve"
      case "Pending": return "Approve"
      default: return "Approve"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getActionButtonColor = (status) => {
    switch (status) {
      case "Approved": return "bg-red-100 text-red-700 hover:bg-red-200"
      case "Rejected": return "bg-green-100 text-green-700 hover:bg-green-200"
      case "Pending": return "bg-green-100 text-green-700 hover:bg-green-200"
      default: return "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved": return <CheckCircle className="h-4 w-4" />
      case "Pending": return <Clock className="h-4 w-4" />
      case "Rejected": return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not available"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = 
      rider.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.PhoneNumber.includes(searchTerm) ||
      rider.VehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || rider.Status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riders Management</h1>
          <p className="text-gray-600">Manage and approve rider registrations</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search riders by name, email, phone, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredRiders.length} rider{filteredRiders.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {/* Riders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rider
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRiders.map((rider) => (
                  <tr key={rider.RiderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {rider.ProfilePictureURL ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={rider.ProfilePictureURL}
                              alt={rider.Name}
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center" 
                               style={{ display: rider.ProfilePictureURL ? 'none' : 'flex' }}>
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {rider.Name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {rider.RiderId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{rider.Email}</div>
                      <div className="text-sm text-gray-500">{rider.PhoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{rider.VehicleNumber}</div>
                      <div className="text-sm text-gray-500">License: {rider.DrivingLicenseNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col gap-1">
                        <span>Aadhar: {rider.AadharCardNumber}</span>
                        <span>License: {rider.DrivingLicenseNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rider.Status)}`}>
                        {rider.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        {/* Approve/Reject Toggle */}
                        <button
                          onClick={() => handleApproveToggle(rider.RiderId, rider.Status)}
                          disabled={updatingId === rider.RiderId}
                          className={`px-3 py-1 cursor-pointer rounded text-xs font-medium transition-colors ${
                            getActionButtonColor(rider.Status)
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {updatingId === rider.RiderId ? "Updating..." : getStatusActionText(rider.Status)}
                        </button>
                        
                        {/* View Details */}
                        <button 
                          onClick={() => handleViewDetails(rider)}
                          className="text-blue-600 cursor-pointer hover:text-blue-900 disabled:opacity-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {/* More Options */}
                        <div className="relative">
                          <button className="text-gray-400 cursor-pointer hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRiders.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No riders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "No riders have been registered yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Translucent Modal */}
      {modalOpen && selectedRider && (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/70"
    onClick={closeModal}
  >
    <div 
      className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {selectedRider.ProfilePictureURL ? (
                <img
                  className="h-16 w-16 rounded-full object-cover border-2 border-blue-100"
                  src={selectedRider.ProfilePictureURL}
                  alt={selectedRider.Name}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-100"
                   style={{ display: selectedRider.ProfilePictureURL ? 'none' : 'flex' }}>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedRider.Name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRider.Status)}`}>
                  {getStatusIcon(selectedRider.Status)}
                  {selectedRider.Status}
                </span>
                <span className="text-sm text-gray-500">ID: {selectedRider.RiderId}</span>
                <span className="text-sm text-gray-500">Vehicle: {selectedRider.VehicleNumber}</span>
              </div>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Modal Content - New Compact Layout */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Personal Information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Contact & Vehicle Card */}
            <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rider Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Contact Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900 truncate">{selectedRider.Email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{selectedRider.PhoneNumber}</p>
                    </div>
                  </div>
                  
                  {selectedRider.Address && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</label>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-900 text-sm">{selectedRider.Address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vehicle & Documents Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Car className="h-4 w-4 text-gray-400" />
                      <p className="text-xl font-bold text-gray-900">{selectedRider.VehicleNumber}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Driving License</label>
                    <p className="text-gray-900 font-medium">{selectedRider.DrivingLicenseNumber}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar Number</label>
                    <p className="text-gray-900 font-medium">{selectedRider.AadharCardNumber}</p>
                  </div>
                </div>
              </div>
              
              {/* Emergency Contact */}
              {(selectedRider.EmergencyContactName || selectedRider.EmergencyContactPhone) && (
                <div className="mt-5 pt-4 border-t border-blue-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency Contact</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">
                      {selectedRider.EmergencyContactName || 'N/A'} 
                      {selectedRider.EmergencyContactPhone && ` (${selectedRider.EmergencyContactPhone})`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Gallery - Horizontal Scroll */}
            <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Aadhar Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <IdCard className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium text-gray-900">Aadhar Card</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedRider.AadharCardFrontURL && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Front Side</p>
                        <img
                          src={selectedRider.AadharCardFrontURL}
                          alt="Aadhar Front"
                          className="w-full h-32 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x128?text=Front+Not+Available"
                          }}
                        />
                      </div>
                    )}
                    {selectedRider.AadharCardBackURL && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Back Side</p>
                        <img
                          src={selectedRider.AadharCardBackURL}
                          alt="Aadhar Back"
                          className="w-full h-32 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x128?text=Back+Not+Available"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Driving License */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-amber-600" />
                    <h4 className="font-medium text-gray-900">Driving License</h4>
                  </div>
                  {selectedRider.DrivingLicensePhotoURL ? (
                    <div>
                      <img
                        src={selectedRider.DrivingLicensePhotoURL}
                        alt="Driving License"
                        className="w-full h-[17rem] object-cover rounded border border-gray-200"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x272?text=License+Not+Available"
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-[17rem] flex items-center justify-center border border-dashed border-gray-300 rounded">
                      <p className="text-gray-400 text-sm">No license photo</p>
                    </div>
                  )}
                </div>

                {/* Vehicle Documents */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Car className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-gray-900">Vehicle</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedRider.VehicleImageURL && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Vehicle Photo</p>
                        <img
                          src={selectedRider.VehicleImageURL}
                          alt="Vehicle"
                          className="w-full h-32 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x128?text=Vehicle+Not+Available"
                          }}
                        />
                      </div>
                    )}
                    {selectedRider.VehicleNumberPlatePhotoURL && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Number Plate</p>
                        <img
                          src={selectedRider.VehicleNumberPlatePhotoURL}
                          alt="Number Plate"
                          className="w-full h-32 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x128?text=Plate+Not+Available"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Timeline & Status */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Timeline</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedRider.Status)}`}>
                        {selectedRider.Status}
                      </span>
                      {selectedRider.Working === 1 && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></div>
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* <button
                    onClick={() => {
                      handleApproveToggle(selectedRider.RiderId, selectedRider.Status)
                    }}
                    disabled={updatingId === selectedRider.RiderId}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      getActionButtonColor(selectedRider.Status)
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {updatingId === selectedRider.RiderId 
                      ? "Updating..." 
                      : getStatusActionText(selectedRider.Status)}
                  </button> */}
                </div>
                
                {/* Timeline */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Registered</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedRider.AddedOn)}</p>
                    </div>
                  </div>
                  
                  {selectedRider.ApprovedOn && selectedRider.Status === "Approved" && (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Approved</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedRider.ApprovedOn)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedRider.UpdatedOn)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50/50 rounded-lg">
                  <p className="text-xs text-gray-500">Rider ID</p>
                  <p className="text-lg font-bold text-gray-900">#{selectedRider.RiderId}</p>
                </div>
                
                <div className="text-center p-3 bg-green-50/50 rounded-lg">
                  <p className="text-xs text-gray-500">Vehicle</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{selectedRider.VehicleNumber}</p>
                </div>
                
                <div className="text-center p-3 bg-purple-50/50 rounded-lg">
                  <p className="text-xs text-gray-500">Documents</p>
                  <p className="text-lg font-bold text-gray-900">3</p>
                </div>
                
                <div className="text-center p-3 bg-amber-50/50 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-bold text-gray-900">{selectedRider.Status}</p>
                </div>
              </div>
            </div>

            {/* Notes/Actions */}
            <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Add message/notification functionality
                    alert(`Send message to ${selectedRider.Name}`)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  💬 Send Message
                </button>
                
                <button
                  onClick={() => {
                    // Add view rides functionality
                    alert(`View rides for ${selectedRider.Name}`)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  📊 View Ride History
                </button>
                
                <button
                  onClick={() => {
                    // Add download docs functionality
                    alert(`Download documents for ${selectedRider.Name}`)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  📥 Download Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Footer - Simplified */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {formatDate(selectedRider.UpdatedOn)}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
            {/* <button
              onClick={() => {
                handleApproveToggle(selectedRider.RiderId, selectedRider.Status)
              }}
              disabled={updatingId === selectedRider.RiderId}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                getActionButtonColor(selectedRider.Status)
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {updatingId === selectedRider.RiderId 
                ? "Updating..." 
                : getStatusActionText(selectedRider.Status)}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  )
}
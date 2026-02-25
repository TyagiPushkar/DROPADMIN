"use client";
import { useState, useEffect } from "react";
import { BASE_URL } from "../page";
import {
  User,
  Phone,
  Hash,
  FileText,
  Car,
  Shield,
  Calendar,
  CreditCard,
  FileCheck,
  Clock,
  Download,
  X,
  IdCard,
  FileBadge,
  Car as CarIcon,
  ShieldCheck
} from "lucide-react";

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(BASE_URL + "rider/get_all_rider.php")
      .then((res) => res.json())
      .then((data) => {
        setRiders(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const DocumentLink = ({ href, children, icon: Icon }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 text-sm"
    >
      <Icon className="w-4 h-4" />
      {children}
      <Download className="w-3 h-3 ml-1" />
    </a>
  );

  const DocumentBadge = ({ available, text }) => (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
      available 
        ? "bg-green-100 text-green-800" 
        : "bg-gray-100 text-gray-800"
    }`}>
      {available ? (
        <FileCheck className="w-3 h-3 mr-1.5" />
      ) : (
        <FileText className="w-3 h-3 mr-1.5" />
      )}
      {text}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className=" mx-2">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Driver Management</h1>
              <p className="text-gray-600 mt-1">View and manage all registered drivers</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                {riders.length} {riders.length === 1 ? 'driver' : 'drivers'} registered
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading driver data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider min-w-[80px]">
                      SL.No
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider min-w-[180px]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Driver Information</span>
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <IdCard className="w-4 h-4" />
                        <span>Documents</span>
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <CarIcon className="w-4 h-4" />
                        <span>Vehicle Details</span>
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Insurance</span>
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wider min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Dates</span>
                      </div>
                    </th>
                  </tr>
                  
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {riders.map((rider, index) => (
                    <tr
                      key={rider.RiderId}
                      onClick={() => setSelectedRider(rider)}
                      className="hover:bg-gray-50/80 transition-colors duration-150 cursor-pointer group"
                    >
                      <td className="p-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <span className="font-semibold text-blue-700">{index + 1}</span>
                        </div>
                      </td>
                      
                      {/* Rider Information */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Name</div>
                            <div className="font-medium text-gray-900">{rider.Name || "—"}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-medium text-sm">{rider.PhoneNumber || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Hash className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-mono text-sm">{rider.AadharCardNumber || "—"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Documents */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">DL Number</div>
                            <div className="font-medium">{rider.DrivingLicenseNumber || "—"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">PAN</div>
                            <div className="font-medium">{rider.PAN_NUMBER || "—"}</div>
                          </div>
                          <DocumentBadge 
                            available={rider.AadharCardFrontURL} 
                            text="Aadhar"
                          />
                        </div>
                      </td>
                      
                      {/* Vehicle Details */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Vehicle Number</div>
                            <div className="font-medium">{rider.VehicleNumber || "—"}</div>
                          </div>
                          <div className="flex gap-2">
                            <DocumentBadge 
                              available={rider.VehicleNumberPlatePhotoURL} 
                              text="Plate"
                            />
                            <DocumentBadge 
                              available={rider.VehicleImageURL} 
                              text="Image"
                            />
                          </div>
                        </div>
                      </td>
                      
                      {/* Insurance */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Insurance Expiry</div>
                            <div className={`font-medium ${
                              rider.INSURANCE_EXPIRY_DATE && new Date(rider.INSURANCE_EXPIRY_DATE) < new Date()
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}>
                              {formatDate(rider.INSURANCE_EXPIRY_DATE)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <DocumentBadge 
                              available={rider.INSURANCE_IMAGE} 
                              text="Insurance"
                            />
                            <DocumentBadge 
                              available={rider.RC_IMAGE} 
                              text="RC"
                            />
                          </div>
                        </div>
                      </td>
                      
                      {/* Dates */}
                      <td className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Date of Joining</div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-green-500" />
                              <span className="font-medium">{formatDate(rider.AddedOn)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Date Of Leaving</div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-blue-500" />
                              <span className="font-medium">{formatDate(rider.DateOfLeaving)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {riders.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
                  <p className="text-gray-500">When drivers register, they'll appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRider && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedRider(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Driver Details</h2>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedRider.Name || "—"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      ID: {selectedRider.RiderId}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRider(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-medium">{selectedRider.Name || "—"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Mobile Number</div>
                    <div className="font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedRider.PhoneNumber || "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Aadhar Number</div>
                    <div className="font-medium font-mono flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      {selectedRider.AadharCardNumber || "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">PAN Number</div>
                    <div className="font-medium">{selectedRider.PAN_NUMBER || "—"}</div>
                  </div>
                </div>
              </div>

              {/* Vehicle & Documents */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Vehicle & Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Vehicle Number</div>
                    <div className="font-medium">{selectedRider.VehicleNumber || "—"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Driving License</div>
                    <div className="font-medium">{selectedRider.DrivingLicenseNumber || "—"}</div>
                  </div>
                </div>
                
                {/* Document Download Links */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-3">Document Downloads</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRider.AadharCardFrontURL && (
                      <DocumentLink href={selectedRider.AadharCardFrontURL} icon={IdCard}>
                        Aadhar Front
                      </DocumentLink>
                    )}
                    {selectedRider.AadharCardBackURL && (
                      <DocumentLink href={selectedRider.AadharCardBackURL} icon={IdCard}>
                        Aadhar Back
                      </DocumentLink>
                    )}
                    {selectedRider.DrivingLicensePhotoURL && (
                      <DocumentLink href={selectedRider.DrivingLicensePhotoURL} icon={FileBadge}>
                        DL Photo
                      </DocumentLink>
                    )}
                    {selectedRider.VehicleNumberPlatePhotoURL && (
                      <DocumentLink href={selectedRider.VehicleNumberPlatePhotoURL} icon={CarIcon}>
                        Vehicle Plate
                      </DocumentLink>
                    )}
                    {selectedRider.VehicleImageURL && (
                      <DocumentLink href={selectedRider.VehicleImageURL} icon={CarIcon}>
                        Vehicle Image
                      </DocumentLink>
                    )}
                    {selectedRider.PAN_IMAGE && (
                      <DocumentLink href={selectedRider.PAN_IMAGE} icon={CreditCard}>
                        PAN Card
                      </DocumentLink>
                    )}
                    {selectedRider.INSURANCE_IMAGE && (
                      <DocumentLink href={selectedRider.INSURANCE_IMAGE} icon={Shield}>
                        Insurance
                      </DocumentLink>
                    )}
                    {selectedRider.RC_IMAGE && (
                      <DocumentLink href={selectedRider.RC_IMAGE} icon={FileText}>
                        RC Document
                      </DocumentLink>
                    )}
                  </div>
                </div>
              </div>

              {/* Insurance & Dates */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Insurance & Dates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Insurance Expiry Date</div>
                    <div className={`font-medium ${
                      selectedRider.INSURANCE_EXPIRY_DATE && 
                      new Date(selectedRider.INSURANCE_EXPIRY_DATE) < new Date()
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}>
                      {formatDate(selectedRider.INSURANCE_EXPIRY_DATE)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Date of Joining</div>
                    <div className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-500" />
                      {formatDate(selectedRider.AddedOn)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {formatDate(selectedRider.UpdatedOn)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium text-green-700">Active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedRider(null)}
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
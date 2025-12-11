"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Phone, 
  Mail, 
  Car, 
  FileText, 
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function RiderDetailsPage() {
  const { id } = useParams();
  const [rider, setRider] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedRider");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (String(parsed.RiderId) === String(id)) {
        setRider(parsed);
      }
    }
  }, [id]);

  if (!rider) return <div className="p-8 text-center text-gray-600">Loading...</div>;

  const isInsuranceValid = () => {
    if (!rider.INSURANCE_EXPIRY_DATE) return false;
    const expiry = new Date(rider.INSURANCE_EXPIRY_DATE.split('-').reverse().join('-'));
    return expiry > new Date();
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">{rider.Name}</h1>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded ${rider.Status === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
              {rider.Status}
            </span>
            <span className={`px-2 py-1 text-xs rounded ${rider.Working ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
              {rider.Working ? "Active" : "Inactive"}
            </span>
            <span className="text-sm text-gray-500">ID: {rider.RiderId}</span>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium">{rider.PhoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium truncate">{rider.Email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Aadhar</p>
              <p className="text-sm font-medium">{rider.AadharCardNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Vehicle</p>
              <p className="text-sm font-medium">{rider.VehicleNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Documents */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aadhar Card */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Aadhar Card</h3>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{rider.AadharCardNumber}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={rider.AadharCardFrontURL} target="_blank" className="group">
                <div className="aspect-square rounded border overflow-hidden">
                  <img src={rider.AadharCardFrontURL} alt="Front" className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <p className="text-xs text-center mt-1 text-gray-600">Front</p>
              </a>
              <a href={rider.AadharCardBackURL} target="_blank" className="group">
                <div className="aspect-square rounded border overflow-hidden">
                  <img src={rider.AadharCardBackURL} alt="Back" className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <p className="text-xs text-center mt-1 text-gray-600">Back</p>
              </a>
            </div>
          </div>

          {/* Driving License */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Driving License</h3>
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">{rider.DrivingLicenseNumber}</span>
            </div>
            <a href={rider.DrivingLicensePhotoURL} target="_blank" className="block group">
              <div className="aspect-square rounded border overflow-hidden">
                <img src={rider.DrivingLicensePhotoURL} alt="License" className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
            </a>
          </div>

          {/* PAN Card */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">PAN Card</h3>
              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">{rider.PAN_NUMBER}</span>
            </div>
            <a href={rider.PAN_IMAGE} target="_blank" className="block group">
              <div className="aspect-video rounded border overflow-hidden">
                <img src={rider.PAN_IMAGE} alt="PAN" className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
            </a>
          </div>

          {/* Vehicle & Insurance */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Vehicle & Insurance</h3>
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${isInsuranceValid() ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {isInsuranceValid() ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                <span className="text-xs">{rider.INSURANCE_EXPIRY_DATE || "No expiry"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <a href={rider.VehicleImageURL} target="_blank" className="group">
                  <div className="aspect-square rounded border overflow-hidden">
                    <img src={rider.VehicleImageURL} alt="Vehicle" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-600">Vehicle</p>
                </a>
                <a href={rider.VehicleNumberPlatePhotoURL} target="_blank" className="group">
                  <div className="aspect-square rounded border overflow-hidden">
                    <img src={rider.VehicleNumberPlatePhotoURL} alt="Plate" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-600">Plate</p>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href={rider.RC_IMAGE} target="_blank" className="group">
                  <div className="aspect-square rounded border overflow-hidden">
                    <img src={rider.RC_IMAGE} alt="RC" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-600">RC</p>
                </a>
                <a href={rider.INSURANCE_IMAGE} target="_blank" className="group">
                  <div className="aspect-square rounded border overflow-hidden">
                    <img src={rider.INSURANCE_IMAGE} alt="Insurance" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-600">Insurance</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile & Status */}
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Profile Details</h3>
            <div className="flex items-start gap-3 mb-4">
              <img src={rider.ProfilePictureURL} alt={rider.Name} className="h-14 w-14 rounded-full object-cover border" />
              <div>
                <p className="font-medium">{rider.Name}</p>
                <p className="text-sm text-gray-600">Rider #{rider.RiderId}</p>
                <p className="text-xs text-gray-500">Added: {new Date(rider.AddedOn).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{rider.PhoneNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium truncate">{rider.Email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{rider.VehicleNumber}</span>
              </div>
              {rider.Address && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right">{rider.Address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Verification Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Status</span>
                <span className={`px-2 py-1 text-xs rounded ${rider.Status === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {rider.Status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Working Status</span>
                <span className={`px-2 py-1 text-xs rounded ${rider.Working ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                  {rider.Working ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Insurance</span>
                <span className={`px-2 py-1 text-xs rounded ${isInsuranceValid() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {isInsuranceValid() ? "Valid" : "Expired"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved On</span>
                <span className="text-sm font-medium">{new Date(rider.ApprovedOn).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
}
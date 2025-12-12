"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Phone, 
  Mail, 
  Car, 
  Shield,
  AlertCircle,
  CheckCircle,
  User,
  FileCheck,
  Calendar,
  MapPin,
  BadgeCheck,
  Clock,
  FileText,
  BookOpen,
  IdCard,
  FileArchive,
  FileImage,
  CreditCard,
  FileDigit
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

  if (!rider) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200/30 rounded w-64 mb-8"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200/30 rounded"></div>
              <div className="h-12 bg-gray-200/30 rounded"></div>
              <div className="h-12 bg-gray-200/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isInsuranceValid = () => {
    if (!rider.INSURANCE_EXPIRY_DATE) return false;
    const expiry = new Date(rider.INSURANCE_EXPIRY_DATE.split('-').reverse().join('-'));
    return expiry > new Date();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return "text-emerald-600 bg-emerald-50";
      case "Pending": return "text-amber-600 bg-amber-50";
      case "Rejected": return "text-rose-600 bg-rose-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  // Single source of truth for documents
  const documents = [
    { 
      label: "Aadhar Card", 
      number: rider.AadharCardNumber,
      type: "Identification",
      icon: <IdCard className="h-4 w-4" />,
      urls: [
        { label: "Front View", url: rider.AadharCardFrontURL },
        { label: "Back View", url: rider.AadharCardBackURL }
      ]
    },
    { 
      label: "PAN Card", 
      number: rider.PAN_NUMBER,
      type: "Identification",
      icon: <CreditCard className="h-4 w-4" />,
      urls: [
        { label: "PAN Card", url: rider.PAN_IMAGE }
      ]
    },
    { 
      label: "Driving License", 
      number: rider.DrivingLicenseNumber,
      type: "License",
      icon: <FileCheck className="h-4 w-4" />,
      urls: [
        { label: "License Photo", url: rider.DrivingLicensePhotoURL }
      ]
    },
    { 
      label: "Vehicle Documents", 
      number: rider.VehicleNumber,
      type: "Vehicle",
      icon: <Car className="h-4 w-4" />,
      urls: [
        { label: "Vehicle Photo", url: rider.VehicleImageURL },
        { label: "Number Plate", url: rider.VehicleNumberPlatePhotoURL },
        { label: "RC Book", url: rider.RC_IMAGE },
        { label: "Insurance", url: rider.INSURANCE_IMAGE }
      ]
    }
  ];

  const documentSections = [
    {
      title: "Personal Details",
      icon: <User className="h-4 w-4" />,
      rows: [
        { label: "Full Name", value: rider.Name },
        { label: "Email", value: rider.Email, icon: <Mail className="h-4 w-4" /> },
        { label: "Phone", value: rider.PhoneNumber, icon: <Phone className="h-4 w-4" /> },
        { label: "Address", value: rider.Address, icon: <MapPin className="h-4 w-4" /> }
      ]
    },
    {
      title: "Status & Verification",
      icon: <Shield className="h-4 w-4" />,
      rows: [
        { 
          label: "Account Status", 
          value: rider.Status,
          badge: true,
          badgeColor: getStatusColor(rider.Status)
        },
        { 
          label: "Working Status", 
          value: rider.Working ? "Active" : "Inactive",
          badge: true,
          badgeColor: rider.Working ? "text-blue-600 bg-blue-50" : "text-gray-600 bg-gray-50"
        },
        { 
          label: "Insurance Status", 
          value: isInsuranceValid() ? "Valid" : "Expired",
          badge: true,
          badgeColor: isInsuranceValid() ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
        },
        { 
          label: "Approval Date", 
          value: new Date(rider.ApprovedOn).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          icon: <Calendar className="h-4 w-4" />
        },
        { 
          label: "Member Since", 
          value: new Date(rider.AddedOn).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          }),
          icon: <Clock className="h-4 w-4" />
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{rider.Name}</h1>
              <p className="text-sm text-gray-500">Rider ID: #{rider.RiderId}</p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor(rider.Status)}`}>
              <div className={`h-2 w-2 rounded-full ${rider.Status === "Approved" ? "bg-emerald-500" : "bg-amber-500"}`}></div>
              <span className="text-sm font-medium">{rider.Status}</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${rider.Working ? "text-blue-600 bg-blue-50" : "text-gray-600 bg-gray-50"}`}>
              <div className={`h-2 w-2 rounded-full ${rider.Working ? "bg-blue-500" : "bg-gray-400"}`}></div>
              <span className="text-sm font-medium">{rider.Working ? "Active" : "Inactive"}</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${isInsuranceValid() ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
              {isInsuranceValid() ? 
                <CheckCircle className="h-3 w-3" /> : 
                <AlertCircle className="h-3 w-3" />
              }
              <span className="text-sm font-medium">Insurance {isInsuranceValid() ? "Valid" : "Expired"}</span>
            </div>
          </div>
        </div>

        {/* Main Dashboard Table */}
        <div className="space-y-6">
          {/* Personal Details & Status */}
          {documentSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="text-gray-600">
                    {section.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>
              </div>

              {/* Section Rows */}
              <div className="divide-y divide-gray-100">
                {section.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="px-6 py-4 hover:bg-gray-50/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {row.icon && (
                            <div className="text-gray-400">
                              {row.icon}
                            </div>
                          )}
                          <div>
                            <div className="text-sm text-gray-600 font-medium">{row.label}</div>
                            <div className="text-base font-semibold text-gray-900 mt-0.5">{row.value}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {row.badge && (
                          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${row.badgeColor}`}>
                            {row.value}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Documents Section - Single consolidated view */}
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Documents & Files</h3>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {documents.map((doc, docIndex) => (
                <div key={docIndex} className="px-6 py-4 hover:bg-gray-50/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          {doc.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{doc.label}</div>
                          {doc.number && (
                            <div className="text-xs text-gray-500 mt-0.5">{doc.number}</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Document links */}
                      <div className="ml-11 mt-3">
                        <div className="flex flex-wrap gap-2">
                          {doc.urls.map((urlDoc, urlIndex) => (
                            <a
                              key={urlIndex}
                              href={urlDoc.url}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                              <FileImage className="h-3.5 w-3.5" />
                              {urlDoc.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                        {doc.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <FileArchive className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
                  <div className="text-sm text-gray-600">Document Categories</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {documents.reduce((total, doc) => total + doc.urls.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Files</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date(rider.ApprovedOn).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-600">Year Approved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
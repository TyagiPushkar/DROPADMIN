"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  Car,
  Bike,
  Shield,
  AlertCircle,
  CheckCircle,
  User,
  FileCheck,
  Calendar,
  MapPin,
  Clock,
  FileText,
  BookOpen,
  IdCard,
  FileArchive,
  FileImage,
  CreditCard,
  Download,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
  Award,
  TrendingUp,
  Activity,
  Briefcase,
  MessageSquare,
  Edit,
  Printer,
  Share2,
  MoreVertical,
  BadgeCheck,
  Hash,
  CarTaxiFront,
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
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
    },
    Rejected: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: AlertCircle,
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

// Professional Info Card Component
const InfoCard = ({ icon: Icon, label, value, subtext, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600">{label}</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {value}
          </div>
          {subtext && (
            <div className="text-xs text-gray-500 mt-1">{subtext}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Professional Document Card Component
const DocumentCard = ({ document }) => {
  const { label, number, type, icon: Icon, urls } = document;

  const completed = urls.filter((url) => url.url).length;
  const total = urls.length;
  const isComplete = completed === total;

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{label}</div>
            {number && (
              <div className="text-sm text-gray-500 mt-0.5">{number}</div>
            )}
          </div>
        </div>
        <div
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isComplete
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {completed}/{total}
        </div>
      </div>

      <div className="space-y-2">
        {urls.map((urlDoc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{urlDoc.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {urlDoc.url ? (
                <>
                  <a
                    href={urlDoc.url}
                    target="_blank"
                    className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    title="View"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={urlDoc.url}
                    download
                    className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </>
              ) : (
                <span className="text-xs text-rose-600">Missing</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function RiderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("selectedRider");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (String(parsed.RiderId) === String(id)) {
          setRider(parsed);
        }
      } catch (error) {
        console.error("Error parsing rider data:", error);
      }
    }
    setTimeout(() => setLoading(false), 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-white rounded-xl border border-gray-200"
                ></div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-white rounded-xl border border-gray-200"></div>
              <div className="h-96 bg-white rounded-xl border border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Rider not found
            </h3>
            <p className="text-gray-600 mb-6">
              The requested rider details could not be loaded.
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Riders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isInsuranceValid = () => {
    if (!rider.INSURANCE_EXPIRY_DATE) return false;
    try {
      const expiry = new Date(rider.INSURANCE_EXPIRY_DATE);
      return expiry > new Date();
    } catch {
      return false;
    }
  };

  const calculateDocumentStats = () => {
    const documents = getDocuments();
    const totalFiles = documents.reduce(
      (sum, doc) => sum + doc.urls.filter((url) => url.url).length,
      0
    );
    const totalPossibleFiles = documents.reduce(
      (sum, doc) => sum + doc.urls.length,
      0
    );
    const completionRate =
      totalPossibleFiles > 0
        ? Math.round((totalFiles / totalPossibleFiles) * 100)
        : 0;

    return {
      totalCategories: documents.length,
      totalFiles,
      totalPossibleFiles,
      completionRate,
      isComplete: completionRate === 100,
    };
  };

  const getDocuments = () => [
    {
      label: "Aadhar Card",
      number: rider.AadharCardNumber,
      type: "Identification",
      icon: IdCard,
      urls: [
        { label: "Front View", url: rider.AadharCardFrontURL },
        { label: "Back View", url: rider.AadharCardBackURL },
      ],
    },
    {
      label: "PAN Card",
      number: rider.PAN_NUMBER,
      type: "Tax Identification",
      icon: CreditCard,
      urls: [{ label: "PAN Card", url: rider.PAN_IMAGE }],
    },
    {
      label: "Driving License",
      number: rider.DrivingLicenseNumber,
      type: "License",
      icon: FileCheck,
      urls: [{ label: "License Photo", url: rider.DrivingLicensePhotoURL }],
    },
    {
      label: "Vehicle Documents",
      number: rider.VehicleNumber,
      type: "Vehicle",
      icon: Car,
      urls: [
        { label: "Vehicle Photo", url: rider.VehicleImageURL },
        { label: "Number Plate", url: rider.VehicleNumberPlatePhotoURL },
        { label: "RC Book", url: rider.RC_IMAGE },
        { label: "Insurance", url: rider.INSURANCE_IMAGE },
      ],
    },
  ];

  const documentStats = calculateDocumentStats();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center">
                  <img src={rider.ProfilePictureURL} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {rider.Name}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">
                      Rider ID: #{rider.RiderId}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      Joined{" "}
                      {new Date(rider.AddedOn).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={rider.Status} />
                <div
                  className={`h-2 w-2 rounded-full ${
                    rider.Working
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                ></div>
              </div>
              {/* <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Printer className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div> */}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <InfoCard
              icon={Phone}
              label="Contact"
              value={rider.PhoneNumber}
              subtext={rider.Email}
              color="blue"
            />
            <InfoCard
              icon={Bike}
              label="Vehicle"
              value={rider.VehicleNumber}
              subtext={rider.VehicleType || "Two-wheeler"}
              color="emerald"
            />
            <InfoCard
              icon={Award}
              label="Status"
              value={rider.Status || "Pending"}
              subtext={rider.Working ? "Active" : "Inactive"}
              color="purple"
            />
            <InfoCard
              icon={Calendar}
              label="Insurance"
              value={isInsuranceValid() ? "Valid" : "Expired"}
              subtext={
                rider.INSURANCE_EXPIRY_DATE
                  ? `Until ${new Date(
                      rider.INSURANCE_EXPIRY_DATE
                    ).toLocaleDateString()}`
                  : "No expiry"
              }
              color={isInsuranceValid() ? "emerald" : "rose"}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Personal Info */}
          <div className="space-y-6">
            {/* Personal Details */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Full Name
                      </div>
                      <div className="text-base font-semibold text-gray-900">
                        {rider.Name}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Phone Number
                      </div>
                      <div className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {rider.PhoneNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Email Address
                      </div>
                      <div className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {rider.Email || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Aadhar Number
                      </div>
                      <div className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        {rider.AadharCardNumber}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Address
                      </div>
                      <div className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {rider.Address || "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <CarTaxiFront className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Vehicle Information
                  </h3>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Vehicle Number
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {rider.VehicleNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Vehicle Type
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {rider.VehicleType || "Two-wheeler"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Insurance Expiry
                    </div>
                    <div
                      className={`text-base font-semibold flex items-center gap-2 ${
                        isInsuranceValid()
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      {rider.INSURANCE_EXPIRY_DATE
                        ? new Date(
                            rider.INSURANCE_EXPIRY_DATE
                          ).toLocaleDateString()
                        : "Not available"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Driving License
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {rider.DrivingLicenseNumber || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Documents & Stats */}
          <div className="space-y-6">
            {/* Document Summary */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Document Status
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Completion:</span>
                    <span
                      className={`font-semibold ${
                        documentStats.isComplete
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {documentStats.completionRate}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-600">
                        Total Files
                      </div>
                      <FileArchive className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {documentStats.totalFiles}/
                      {documentStats.totalPossibleFiles}
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          documentStats.isComplete
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${documentStats.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-600">
                        Document Categories
                      </div>
                      <BookOpen className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {documentStats.totalCategories}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      All categories
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Documents & Verification
                    </h3>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {getDocuments().map((doc, index) => (
                    <DocumentCard key={index} document={doc} />
                  ))}
                </div>
              </div>
            </div>

            {/* Activity & Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-emerald-50">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Profile Approved
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        Account was approved on{" "}
                        {new Date(rider.ApprovedOn).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(rider.ApprovedOn).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-50">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Account Created
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        Registered on{" "}
                        {new Date(rider.AddedOn).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(rider.AddedOn).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-purple-50">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Document Upload
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {documentStats.totalFiles} out of{" "}
                        {documentStats.totalPossibleFiles} documents uploaded
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Just now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(rider.AddedOn).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
            >
              Back to List
            </button>
            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Download Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

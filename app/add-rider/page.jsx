"use client";

import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  User,
  Phone,
  Mail,
  IdCard,
  Bike,
  FileText,
  Check,
  Building,
} from "lucide-react";

// Validation schema for all fields
const riderSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[A-Za-z\s]{3,}$/, "Enter valid name (letters and spaces only)"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  aadhar_number: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
  dl_number: z
    .string()
    .regex(/^[A-Z]{2}[0-9]{13}$/, "Enter valid DL number (no hyphens)"),
  vehicle_number: z
    .string()
    .regex(
      /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
      "Format: MH12AB1234, Remove spaces/hyphens"
    ),
  agency_name: z.string().optional().or(z.literal("")), // Agency name is optional
});

const API_URL = "https://namami-infotech.com/DROP/src/rider/onboard.php";
const AGENCIES_API =
  "https://namami-infotech.com/DROP/src/rider/get_agencies.php"; // Add your API endpoint

export default function RiderOnboarding() {
  const [loading, setLoading] = useState(false);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [agencies, setAgencies] = useState([]);

  // Use refs for file data (stable, won't trigger re-renders)
  const fileDataRef = useRef({
    profile_picture: null,
    aadhar_front: null,
    aadhar_back: null,
    dl_photo: null,
    vehicle_plate_photo: null,
  });

  // UseForm with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(riderSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      agency_name: "", // Default to empty
    },
  });

  // Fetch agencies on component mount
  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    setLoadingAgencies(true);
    try {
      const response = await fetch(AGENCIES_API);
      const data = await response.json();

      if (data.success) {
        setAgencies(data.data || []);
      } else {
        console.error("Failed to fetch agencies:", data.message);
        // Set default agencies if API fails
        setAgencies([
          { id: 1, name: "Agency 1" },
          { id: 2, name: "Agency 2" },
          { id: 3, name: "Agency 3" },
          { id: 4, name: "No Agency" },
        ]);
      }
    } catch (err) {
      console.error("Error fetching agencies:", err);
      // Set default agencies on error
      setAgencies([
        { id: 1, name: "Agency 1" },
        { id: 2, name: "Agency 2" },
        { id: 3, name: "Agency 3" },
        { id: 4, name: "No Agency" },
      ]);
    } finally {
      setLoadingAgencies(false);
    }
  };

  // Handle file changes (store in ref)
  const handleFileChange = (fieldName, file) => {
    fileDataRef.current[fieldName] = file;
  };

  const FormInput = ({
    label,
    name,
    type = "text",
    placeholder,
    transform = null,
    required = true,
  }) => {
    const [localValue, setLocalValue] = useState("");
    const field = register(name);

    return (
      <div>
        <label className="block text-sm font-medium text-cyan-900 mb-2">
          {label} {required && "*"}
        </label>

        <div className="relative">
          <input
            type={type}
            placeholder={placeholder}
            {...field}
            onChange={(e) => {
              let v = e.target.value;
              if (transform === "uppercase") v = v.toUpperCase();
              else if (transform === "email") v = v.toLowerCase();

              e.target.value = v;
              setLocalValue(v);

              if (field && typeof field.onChange === "function") {
                field.onChange(e);
              }
            }}
            className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 placeholder-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition pr-10"
          />

          {localValue && localValue.length > 0 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={14} className="text-green-600" />
              </div>
            </div>
          )}
        </div>

        {errors[name] ? (
          <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
        ) : localValue && localValue.length > 0 ? (
          <p className="text-green-600 text-sm mt-1">
            ✓ Valid {label.toLowerCase()}
          </p>
        ) : null}
      </div>
    );
  };

  const FormSelect = ({
    label,
    name,
    options = [],
    placeholder = "Select an option",
    required = false,
  }) => {
    const [localValue, setLocalValue] = useState("");
    const field = register(name);

    return (
      <div>
        <label className="block text-sm font-medium text-cyan-900 mb-2">
          {label} {required && "*"}
        </label>

        <div className="relative">
          <select
            {...field}
            onChange={(e) => {
              const v = e.target.value;
              setLocalValue(v);

              if (field && typeof field.onChange === "function") {
                field.onChange(e);
              }
            }}
            className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 placeholder-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition appearance-none pr-10"
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.id || option} value={option.name || option}>
                {option.name || option}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>

          {localValue && localValue.length > 0 && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={14} className="text-green-600" />
              </div>
            </div>
          )}
        </div>

        {errors[name] ? (
          <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
        ) : localValue && localValue.length > 0 ? (
          <p className="text-green-600 text-sm mt-1">
            ✓ {label.toLowerCase()} selected
          </p>
        ) : null}
      </div>
    );
  };

  const FileInput = ({
    label,
    name,
    accept = "image/*,.pdf",
    required = true,
  }) => {
    const [fileName, setFileName] = useState("");

    return (
      <div>
        <label className="block text-sm font-medium text-cyan-900 mb-2">
          {label} {required && "*"}
        </label>
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileChange(name, file);
              setFileName(file.name);
            }
          }}
          className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 transition"
        />
        {fileName && (
          <p className="text-sm text-green-600 mt-1 flex items-center">
            <Check size={14} className="mr-1" /> {fileName}
          </p>
        )}
      </div>
    );
  };

  const onSubmit = async (data) => {
    // Required files check
    const requiredFiles = [
      "profile_picture",
      "aadhar_front",
      "aadhar_back",
      "dl_photo",
      "vehicle_plate_photo",
    ];
    const missingFiles = requiredFiles.filter((f) => !fileDataRef.current[f]);

    if (missingFiles.length > 0) {
      const namesMap = {
        profile_picture: "Profile Photo",
        aadhar_front: "Aadhar Front Image",
        aadhar_back: "Aadhar Back Image",
        dl_photo: "Driving License Image",
        vehicle_plate_photo: "Vehicle Plate Image",
      };
      const fileNames = missingFiles.map((f) => namesMap[f]);
      setError(`Please upload all required documents: ${fileNames.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();

      // Append all non-file fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, value.toString());
        }
      });

      // Append files from ref
      Object.entries(fileDataRef.current).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        }
      });

      // Log form data for debugging
      console.log("Submitting form data:", {
        ...data,
        files: Object.keys(fileDataRef.current).filter(
          (key) => fileDataRef.current[key]
        ),
      });

      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setSuccess("✅ Rider onboarded successfully!");
        // Reset form
        reset();
        fileDataRef.current = {
          profile_picture: null,
          aadhar_front: null,
          aadhar_back: null,
          dl_photo: null,
          vehicle_plate_photo: null,
        };
        // Clear file inputs
        document.querySelectorAll('input[type="file"]').forEach((input) => {
          input.value = "";
        });
      } else {
        setError(responseData.message || "Failed to onboard rider");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-cyan-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/droplogo.jpg" alt="DROP" className="w-10 h-10" />
            <h1 className="text-xl font-bold text-cyan-900 hidden sm:block">
              DROP Rider Onboarding
            </h1>
          </div>
          <div className="text-sm text-cyan-700 font-medium">
            All Fields Required
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-900 mb-2">
              Rider Information
            </h2>
            <p className="text-cyan-600">
              Please fill in all required fields and upload the necessary
              documents.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur border-2 border-cyan-200 rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-cyan-900 mb-6 flex items-center gap-2">
                <User size={20} /> Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  name="name"
                  placeholder="Rajesh Kumar"
                />
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                />
              </div>

              <div className="mt-6">
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="rajesh@example.com"
                  transform="email"
                  required={false}
                />
              </div>

              <div className="mt-6">
                <FileInput label="Profile Photo" name="profile_picture" />
              </div>
            </div>

            {/* Agency Information */}
            <div className="bg-white/80 backdrop-blur border-2 border-cyan-200 rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-cyan-900 mb-6 flex items-center gap-2">
                <Building size={20} /> Agency Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormSelect
                  label="Agency Name"
                  name="agency_name"
                  placeholder="Select Agency"
                  options={agencies}
                  required={false}
                />
                {loadingAgencies && (
                  <div className="flex items-center text-cyan-600">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 010 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z"
                      />
                    </svg>
                    Loading agencies...
                  </div>
                )}
              </div>

              <p className="text-sm text-cyan-600 mt-2">
                Note: Agency selection is optional. Select "No Agency" if rider
                is independent.
              </p>
            </div>

            {/* Aadhar Card Information */}
            <div className="bg-white/80 backdrop-blur border-2 border-cyan-200 rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-cyan-900 mb-6 flex items-center gap-2">
                <IdCard size={20} /> Aadhar Card Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="Aadhar Number"
                  name="aadhar_number"
                  placeholder="123456789012"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <FileInput label="Aadhar Front Image" name="aadhar_front" />
                <FileInput label="Aadhar Back Image" name="aadhar_back" />
              </div>
            </div>

            {/* Driving License */}
            <div className="bg-white/80 backdrop-blur border-2 border-cyan-200 rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-cyan-900 mb-6 flex items-center gap-2">
                <FileText size={20} /> Driving License Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="DL Number"
                  name="dl_number"
                  placeholder="WB2020255566537"
                  transform="uppercase"
                />
              </div>

              <div className="mt-6">
                <FileInput label="Driving License Image" name="dl_photo" />
              </div>
            </div>

            {/* RC/Smart Card */}
            <div className="bg-white/80 backdrop-blur border-2 border-cyan-200 rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-cyan-900 mb-6 flex items-center gap-2">
                <Bike size={20} /> Vehicle Details (RC/Smart Card)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="Vehicle Number"
                  name="vehicle_number"
                  placeholder="WB20AB1234"
                  transform="uppercase"
                />
              </div>

              <div className="mt-6">
                <FileInput
                  label="RC/Smart Card Image"
                  name="vehicle_plate_photo"
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            <div className="animate-fadeIn">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center animate-fadeIn">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 010 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application <Check size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Form Requirements */}
          <div className="mt-8 bg-cyan-50 border border-cyan-200 rounded-lg p-4 animate-fadeIn">
            <h4 className="font-semibold text-cyan-900 mb-2">Requirements:</h4>
            <ul className="text-sm text-cyan-700 space-y-1">
              <li className="flex items-center">
                <Check size={14} className="mr-2 text-green-600" />
                All fields marked with * are required
              </li>
              <li className="flex items-center">
                <Check size={14} className="mr-2 text-green-600" />
                Upload clear images of documents
              </li>
              <li className="flex items-center">
                <Check size={14} className="mr-2 text-green-600" />
                Supported formats: JPG, PNG, PDF
              </li>
              <li className="flex items-center">
                <Check size={14} className="mr-2 text-green-600" />
                Maximum file size: 5MB per document
              </li>
              <li className="flex items-center">
                <Check size={14} className="mr-2 text-green-600" />
                Agency selection is optional
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

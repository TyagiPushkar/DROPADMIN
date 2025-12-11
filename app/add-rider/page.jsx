"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, Phone, Mail, IdCard, Bike, FileText, Check } from "lucide-react";

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
});

const API_URL = "https://namami-infotech.com/DROP/src/rider/onboard.php";

export default function RiderOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  } = useForm({
    resolver: zodResolver(riderSchema),
    mode: "onSubmit", // ⬅️ Important
    reValidateMode: "onChange",
  });

  // Handle file changes (store in ref)
  const handleFileChange = (fieldName, file) => {
    fileDataRef.current[fieldName] = file;
  };

  //
  // --- INPUT COMPONENTS (logic-only changes) ---
  //
  // Important design:
  // - Each FormInput keeps its own local state for the visible value/tick so typing doesn't re-render parent.
  // - We call register(name) once and reuse the returned handlers (field) — then call field.onChange inside our onChange.
  // - We apply transforms before calling field.onChange.
  //

  const FormInput = ({
    label,
    name,
    type = "text",
    placeholder,
    transform = null,
    required = true,
  }) => {
    // local state used only for this input component (keeps the green tick / "valid" text)
    const [localValue, setLocalValue] = useState("");
    // get the register field once
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
            // apply registered props (name, ref, onBlur etc)
            {...field}
            onChange={(e) => {
              // transform value if requested
              let v = e.target.value;
              if (transform === "uppercase") v = v.toUpperCase();
              else if (transform === "email") v = v.toLowerCase();

              // update the DOM value so the input displays transformed text
              e.target.value = v;

              // update local component state (this re-renders only this input)
              setLocalValue(v);

              // call react-hook-form's onChange from register
              if (field && typeof field.onChange === "function") {
                field.onChange(e);
              }
            }}
            className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 placeholder-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition pr-10"
          />

          {/* green tick if there's local text */}
          {localValue && localValue.length > 0 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={14} className="text-green-600" />
              </div>
            </div>
          )}
        </div>

        {/* Error or Valid message */}
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

  const FileInput = ({
    label,
    name,
    accept = "image/*,.pdf",
    required = true,
  }) => {
    // local filename to show the uploaded filename (component-level state only)
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

  //
  // --- SUBMIT HANDLER (same robust logic as Form 1) ---
  //
  const onSubmit = async (data) => {
    // Required files check (same as before)
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

      // Append all non-file fields (only append if present)
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

      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setSuccess("✅ Rider onboarded successfully!");
        // Reset form fields and files (same approach as Form 1)
        reset();
        fileDataRef.current = {
          profile_picture: null,
          aadhar_front: null,
          aadhar_back: null,
          dl_photo: null,
          vehicle_plate_photo: null,
        };
        // Clear file input DOM nodes
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

  //
  // --- RENDER (UI kept exactly the same as your Form 2) ---
  //
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
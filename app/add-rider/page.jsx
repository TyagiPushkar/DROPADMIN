"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Shield,
  Bike,
  FileText,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  IdCard,
} from "lucide-react";

// Validation schemas - Combined step 1 (email) into step 2 (personal)
const step1Schema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[A-Za-z\s]{3,}$/, "Enter valid name (letters and spaces only)"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian phone number"),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address too long"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
});

const step2Schema = z.object({
  aadhar_number: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
  pan_number: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter valid PAN (e.g., ABCDE1234F)"),
});

const step3Schema = z.object({
  dl_number: z
    .string()
    .regex(/^[A-Z]{2}[0-9]{13}$/, "Enter valid DL number (no hyphens)"),
  vehicle_number: z
    .string()
    .regex(
      /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
      "Format: MH12AB1234, Remove spaces/hyphens"
    ),
  insurance_expiry_date: z
    .string()
    .min(1, "Insurance expiry date is required")
    .refine((date) => {
      const expDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return expDate >= today;
    }, "Insurance must not be expired"),
});

const steps = [
  { id: 1, title: "Personal", icon: <User size={16} />, schema: step1Schema },
  { id: 2, title: "Identity", icon: <IdCard size={16} />, schema: step2Schema },
  { id: 3, title: "Vehicle", icon: <Bike size={16} />, schema: step3Schema },
  { id: 4, title: "Documents", icon: <FileText size={16} /> },
];

const API_URL = "https://namami-infotech.com/DROP/src/rider/onboard.php";

export default function RiderOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Use refs for form data to prevent re-renders
  const formDataRef = useRef({
    email: "",
    name: "",
    phone: "",
    address: "",
    aadhar_number: "",
    pan_number: "",
    dl_number: "",
    vehicle_number: "",
    insurance_expiry_date: "",
    profile_picture: null,
    aadhar_front: null,
    aadhar_back: null,
    dl_photo: null,
    vehicle_plate_photo: null,
    vehicle_image: null,
    pan_image: null,
    insurance_image: null,
    rc_image: null,
  });

  const currentSchema = useMemo(() => {
    return steps.find((s) => s.id === step)?.schema || step1Schema;
  }, [step]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(currentSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    const data = formDataRef.current;

    if (step === 1) {
      setValue("name", data.name ?? "");
      setValue("phone", data.phone ?? "");
      setValue("address", data.address ?? "");
      setValue("email", data.email ?? "");
    } else if (step === 2) {
      setValue("aadhar_number", data.aadhar_number ?? "");
      setValue("pan_number", data.pan_number ?? "");
    } else if (step === 3) {
      setValue("dl_number", data.dl_number ?? "");
      setValue("vehicle_number", data.vehicle_number ?? "");
      setValue("insurance_expiry_date", data.insurance_expiry_date ?? "");
    }
  }, [step, setValue]);

  // Handle form submission for each step
  const onStepSubmit = (data) => {
    // Update the ref with current step data
    formDataRef.current = { ...formDataRef.current, ...data };

    if (step < 4) {
      setStep((prev) => prev + 1);
      setError("");
    }
  };

  // Handle file changes separately
  const handleFileChange = (fieldName, file) => {
    formDataRef.current[fieldName] = file;
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    setError("");
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();

      // Add all form data to FormData
      Object.entries(formDataRef.current).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await fetch(API_URL, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("✅ Rider onboarded successfully!");
        // Reset form
        formDataRef.current = {
          email: "",
          name: "",
          phone: "",
          address: "",
          aadhar_number: "",
          pan_number: "",
          dl_number: "",
          vehicle_number: "",
          insurance_expiry_date: "",
          profile_picture: null,
          aadhar_front: null,
          aadhar_back: null,
          dl_photo: null,
          vehicle_plate_photo: null,
          vehicle_image: null,
          pan_image: null,
          insurance_image: null,
          rc_image: null,
        };
        setStep(1);
        reset();
      } else {
        setError(data.message || "Failed to onboard rider");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Form components
  const FormInput = ({
    label,
    name,
    type = "text",
    placeholder,
    register,
    error,
    transform = null,
  }) => (
    <div>
      <label className="block text-sm font-medium text-cyan-900 mb-2">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        onChange={(e) => {
          let value = e.target.value;
          if (transform === "uppercase") {
            value = value.toUpperCase();
          } else if (transform === "email") {
            value = value.toLowerCase();
          }
          e.target.value = value;
          register(name).onChange(e);
        }}
        placeholder={placeholder}
        className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 placeholder-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );

  const FileInput = ({ label, name, accept = "image/*,.pdf", onChange }) => {
    const inputRef = useRef(null);

    return (
      <div>
        <label className="block text-sm font-medium text-cyan-900 mb-2">
          {label} *
        </label>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleFileChange(name, file);
              if (onChange) onChange(file);
            }
          }}
          className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 transition"
        />
        {formDataRef.current[name] && (
          <p className="text-sm text-green-600 mt-1">
            ✓ {formDataRef.current[name].name}
          </p>
        )}
      </div>
    );
  };

  // Render current step
  const renderStep = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fadeIn">
            <div className="bg-cyan-50/50 border-2 border-cyan-200 p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-semibold text-cyan-900 flex items-center gap-2">
                <User size={20} /> Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name *"
                  name="name"
                  placeholder="Rajesh Kumar"
                  register={register}
                  error={errors.name}
                />
                <FormInput
                  label="Phone Number *"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  register={register}
                  error={errors.phone}
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="rajesh@example.com"
                  register={register}
                  error={errors.email}
                  transform="email"
                />
                <FormInput
                  label="Address *"
                  name="address"
                  placeholder="Pune, Maharashtra"
                  register={register}
                  error={errors.address}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fadeIn">
            <div className="bg-cyan-50/50 border-2 border-cyan-200 p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-semibold text-cyan-900 flex items-center gap-2">
                <IdCard size={20} /> Identity Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Aadhar Number *"
                  name="aadhar_number"
                  placeholder="123456789012"
                  register={register}
                  error={errors.aadhar_number}
                />
                <FormInput
                  label="PAN Number *"
                  name="pan_number"
                  placeholder="ABCDE1234F"
                  register={register}
                  error={errors.pan_number}
                  transform="uppercase"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fadeIn">
            <div className="bg-cyan-50/50 border-2 border-cyan-200 p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-semibold text-cyan-900 flex items-center gap-2">
                <Bike size={20} /> Vehicle Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="DL Number *"
                  name="dl_number"
                  placeholder="WB2020255566537"
                  register={register}
                  error={errors.dl_number}
                  transform="uppercase"
                />
                <FormInput
                  label="Smart Card (Bike Number) *"
                  name="vehicle_number"
                  placeholder="WB20AB1234"
                  register={register}
                  error={errors.vehicle_number}
                  transform="uppercase"
                />
              </div>
              <FormInput
                label="Insurance Expiry Date *"
                name="insurance_expiry_date"
                type="date"
                register={register}
                error={errors.insurance_expiry_date}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fadeIn">
            <div className="bg-cyan-50/50 border-2 border-cyan-200 p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-semibold text-cyan-900 flex items-center gap-2">
                <FileText size={20} /> Upload Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileInput label="Profile Picture *" name="profile_picture" />
                <FileInput label="Aadhar Front *" name="aadhar_front" />
                <FileInput label="Aadhar Back *" name="aadhar_back" />
                <FileInput label="DL Photo *" name="dl_photo" />
                <FileInput
                  label="Vehicle Plate Photo *"
                  name="vehicle_plate_photo"
                />
                <FileInput label="Vehicle Image *" name="vehicle_image" />
                <FileInput label="PAN Image *" name="pan_image" />
                <FileInput label="Insurance Image *" name="insurance_image" />
                <FileInput label="RC Image *" name="rc_image" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [step, errors, register]);

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
            Step {step} of {steps.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <div className="flex-1">
            <form onSubmit={handleSubmit(onStepSubmit)} className="space-y-6">
              {renderStep()}

              {/* Error/Success Messages */}
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

              {/* Navigation Buttons */}
              <div className="flex gap-4 justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-cyan-200 hover:bg-cyan-50 text-cyan-900 font-medium rounded-lg transition"
                  >
                    <ChevronLeft size={20} /> Previous
                  </button>
                )}

                {step < 4 && (
                  <button
                    type="submit"
                    className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-lg transition shadow-md"
                  >
                    Next <ChevronRight size={20} />
                  </button>
                )}

                {step === 4 && (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="ml-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition shadow-md"
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
                        Submit <Check size={20} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-t border-cyan-200 bg-white/80 backdrop-blur px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 sm:gap-4 justify-between items-center min-w-max sm:min-w-0 pb-2 sm:pb-0">
            {steps.map((s) => {
              const isActive = s.id === step;
              const isCompleted = s.id < step;

              return (
                <div key={s.id} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isCompleted
                        ? "bg-red-500/20 text-red-600 border-2 border-red-500"
                        : isActive
                        ? "bg-cyan-500/30 text-cyan-700 border-2 border-cyan-500"
                        : "bg-white text-cyan-400 border-2 border-cyan-200"
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : s.icon}
                  </div>

                  <span
                    className={`text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                      isCompleted
                        ? "text-red-600"
                        : isActive
                        ? "text-cyan-700"
                        : "text-cyan-500"
                    }`}
                  >
                    {s.title}
                  </span>

                  {s.id < steps.length && (
                    <div
                      className={`w-2 sm:w-4 h-0.5 transition-colors ml-2 ${
                        isCompleted ? "bg-red-500/50" : "bg-cyan-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

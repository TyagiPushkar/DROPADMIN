"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import LocationPicker from "@/components/locationPicker";

// Validation schemas
const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

const otpSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

const ownerInfoSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
});

const restaurantDetailsSchema = z.object({
  type: z.string().nonempty("Select restaurant type."),
  cuisines: z.array(z.string()).min(1, "Select at least one cuisine."),
  avgCost: z
    .string()
    .nonempty("Enter average cost.")
    .refine((val) => /^[0-9]+(\.[0-9]{1,2})?$/.test(val), {
      message: "Average cost must be a valid number.",
    })
    .transform((val) => Number(val))
    .refine((num) => num > 0, {
      message: "Average cost must be greater than 0.",
    }),
    gst: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
      "Enter a valid GST number (15 characters, e.g., 22AAAAA0000A1Z5)"
    )
    .refine((val) => !val || val.length === 15, {
      message: "GST number must be exactly 15 characters.",
    }),

  gstProof: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file ||
        (file instanceof File &&
          ["image/jpeg", "image/png", "application/pdf"].includes(file.type)),
      "Only PDF, PNG, or JPG files are allowed for GST proof."
    )
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
      message: "File size must be under 2MB.",
    }),
  fssai: z
    .string()
    .nonempty("Enter FSSAI number.")
    .regex(/^\d{14}$/, "FSSAI number must be exactly 14 digits."),
  fssaiProof: z
    .any()
    .refine((file) => file instanceof File, "Upload FSSAI proof.")
    .refine(
      (file) => file && ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
      "Only PDF, PNG, or JPG files are allowed for FSSAI proof."
    )
    .refine(
      (file) => file && file.size <= 2 * 1024 * 1024,
      "File size must be under 2MB."
    ),
});

const bankDetailsSchema = z.object({
  accountName: z
    .string()
    .nonempty("Enter account holder name.")
    .regex(
      /^[A-Za-z\s.]+$/,
      "Name can only contain letters, spaces, and dots."
    ),
  accountNumber: z
    .string()
    .nonempty("Enter account number.")
    .regex(/^\d{9,18}$/, "Enter a valid account number (9–18 digits)."),
  ifsc: z
    .string()
    .nonempty("Enter IFSC code.")
    .regex(
      /^[A-Z]{4}0[A-Z0-9]{6}$/,
      "Enter a valid IFSC code (e.g., SBIN0001234)."
    ),
  upi: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(val),
      "Enter a valid UPI ID (e.g., name@bank)."
    ),
  bankProof: z.any().refine((file) => {
    if (!file) return false;
    if (!(file instanceof File)) return false;
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type))
      return false;
    if (file.size > 2 * 1024 * 1024) return false;
    return true;
  }, "Upload a valid file (PDF, PNG, JPG, max 2MB)"),
});
const locationOperationalSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  mapLink: z.string().url("Enter a valid Google Maps link"),
  openingHours: z.string().min(1, "Opening hours required"),
  closingHours: z.string().min(1, "Closing hours required"),
  daysOpen: z.array(z.string()).min(1, "Select at least one day"),
});



const steps = [
  "Email",
  "Verify",
  "Basic Info",
  "Details",
  "Location",
  "Payment",
];

export default function VendorRegistration() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    restaurantName: "",
    ownerName: "",
    phone: "",
    password: "",
    type: "Both",
    cuisines: [],
    avgCost: "",
    gst: "",
    gstProof: null,
    fssai: "",
    fssaiProof: null,
    address: "",
    city: "",
    state: "West Bengal",
    pincode: "",
    mapLink: "",
    openingHours: "",
    closingHours: "",
    daysOpen: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    delivery: false,
    accountName: "",
    accountNumber: "",
    ifsc: "",
    bankProof: null,
    upi: "",
  });
  const resetAll = () => {
    setFormData({
      email: "",
      restaurantName: "",
      ownerName: "",
      phone: "",
      password: "",
      type: "Both",
      cuisines: [],
      avgCost: "",
      gst: "",
      gstProof: null,
      fssai: "",
      fssaiProof: null,
      address: "",
      city: "",
      state: "West Bengal",
      pincode: "",
      mapLink: "",
      openingHours: "",
      closingHours: "",
      daysOpen: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      delivery: false,
      accountName: "",
      accountNumber: "",
      ifsc: "",
      bankProof: null,
      upi: "",
    });
    setEmail("");
    setOtp("");
    setError("");
    setEmailVerified(false);
    resetEmailForm(); 
    resetOtpForm();
  };


  const API_URL = "https://namami-infotech.com/DROPRIDER/src/auth/login.php";
  const REGISTER_URL = "https://namami-infotech.com/DROP/src/restaurants/add_restaurant.php";

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    reset: resetEmailForm,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    reset: resetOtpForm,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
  });

  const handleSendOtp = async (data) => {

    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: data.email, send_otp: true }),
      });
      const responseData = await res.json();

      if (responseData.success) {
        setEmail(data.email);
        setStep(2);
      } else {
        setError(responseData.message || "Failed to send OTP");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email,
          otp: data.otp,
          verify_otp: true,
        }),
      });
      const responseData = await res.json();
      if (responseData.success) {
        Cookies.set("user", JSON.stringify(responseData.data), { expires: 1 });
        setEmailVerified(true);
        setStep(3);
      } else {
        setError(responseData.message || "Invalid OTP");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      if (name === "cuisines") {
        setFormData((prev) => ({
          ...prev,
          cuisines: checked
            ? [...prev.cuisines, value]
            : prev.cuisines.filter((c) => c !== value),
        }));
      } else if (name === "daysOpen") {
        setFormData((prev) => ({
          ...prev,
          daysOpen: checked
            ? [...prev.daysOpen, value]
            : prev.daysOpen.filter((d) => d !== value),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const validation = bankDetailsSchema.safeParse(formData);
      if (!validation.success) {
        const firstError =
          validation.error?.issues?.[0]?.message || "Invalid bank details";
        alert("⚠️ " + firstError);
        setLoading(false);
        return;
      }

      const payload = {
        restaurantName: formData.restaurantName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: email,
        password: formData.phone,
        type: formData.type,
        cuisines: formData.cuisines,
        avgCost: Number.parseFloat(formData.avgCost) || 0,
        gst: formData.gst,
        gstProof: formData.gstProof
          ? `uploads/gst/${formData.gstProof.name}`
          : null,
        fssai: formData.fssai,
        fssaiProof: formData.fssaiProof
          ? `uploads/fssai/${formData.fssaiProof.name}`
          : null,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        mapLink: formData.mapLink,
        openingHours: formData.openingHours + ":00",
        closingHours: formData.closingHours + ":00",
        daysOpen: formData.daysOpen,
        delivery: formData.delivery,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        bankProof: formData.bankProof
          ? `uploads/bank/${formData.bankProof.name}`
          : null,
        upi: formData.upi,
        description: formData.description || "",
        price_range: formData.price_range || "",
        avg_cost_for_two: Number.parseFloat(formData.avg_cost_for_two) || 0,
      };

      const res = await fetch(REGISTER_URL, {
        method: "POST",
        // Don't set Content-Type header - let browser set it with boundary
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit");

      alert("✅ Vendor registration submitted!");
      resetAll();
      setStep(1);
      Cookies.remove("user");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    let validation;

    if (step === 1) validation = emailSchema.safeParse({ email });
    if (step === 2) validation = otpSchema.safeParse({ otp });
    if (step === 3) validation = ownerInfoSchema.safeParse(formData);
    if (step === 4) validation = restaurantDetailsSchema.safeParse(formData);
    if (step === 5) validation = locationOperationalSchema.safeParse(formData);
    if (step === 6) validation = bankDetailsSchema.safeParse(formData);

    if (validation && !validation.success) {
      const firstError =
        validation.error?.issues?.[0]?.message || "Invalid input";
      alert("⚠️ " + firstError);
      return;
    }

    setStep((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-cyan-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
              DR
            </div>
            <h1 className="text-xl font-bold text-cyan-900 hidden sm:block">
              ddrop
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
            {/* Step 1: Email */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <form
                  onSubmit={handleEmailSubmit(handleSendOtp)}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-cyan-900 mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-cyan-700">
                      Enter your email to continue with registration
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-900">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      {...registerEmail("email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 placeholder-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                      required
                    />
                    {emailErrors.email && (
                      <p className="text-red-500 text-sm font-medium">
                        {emailErrors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-md"
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
                        Sending OTP...
                      </>
                    ) : (
                      <>Send OTP</>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <form
                  onSubmit={handleOtpSubmit(handleVerifyOtp)}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-cyan-900 mb-2">
                      Verify Your Email
                    </h2>
                    <p className="text-cyan-700">
                      Enter the 6-digit code we sent to {email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-900">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      placeholder="000000"
                      {...registerOtp("otp")}
                      className="w-full text-center text-2xl tracking-widest bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 placeholder-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                      required
                    />
                    {otpErrors.otp && (
                      <p className="text-red-500 text-sm font-medium">
                        {otpErrors.otp.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>
                </form>
              </div>
            )}

            {/* Steps 3-6: Form Sections */}
            {step >= 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 3: Basic Information */}
                {step === 3 && (
                  <FormSection title="Basic Information">
                    <FormInput
                      label="Restaurant Name"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                    />
                    <FormInput
                      label="Owner / Contact Name"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                    />
                    <FormInput
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </FormSection>
                )}

                {/* Step 4: Restaurant Details */}
                {step === 4 && (
                  <FormSection title="Restaurant Details">
                    <FormInput
                      label="GST Number"
                      name="gst"
                      value={formData.gst}
                      onChange={handleChange}
                    />
                    <div>
                      <label className="text-sm font-medium text-cyan-900 block mb-2">
                        GST Proof
                      </label>
                      <input
                        type="file"
                        name="gstProof"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 transition"
                      />
                    </div>
                    <FormInput
                      label="FSSAI License Number"
                      name="fssai"
                      value={formData.fssai}
                      onChange={handleChange}
                    />
                    <div>
                      <label className="text-sm font-medium text-cyan-900 block mb-2">
                        FSSAI Proof
                      </label>
                      <input
                        type="file"
                        name="fssaiProof"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-cyan-900 block mb-2">
                        Restaurant Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                      >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div className="col-span-full">
                      <label className="text-sm font-medium text-cyan-900 block mb-3">
                        Cuisines
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          "Indian",
                          "Chinese",
                          "Italian",
                          "Mexican",
                          "Fast Food",
                          "Bakery",
                        ].map((cuisine) => (
                          <label
                            key={cuisine}
                            className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-cyan-50 transition"
                          >
                            <input
                              type="checkbox"
                              name="cuisines"
                              value={cuisine}
                              onChange={handleChange}
                              className="accent-cyan-500"
                            />
                            <span className="text-cyan-900 text-sm">
                              {cuisine}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <FormInput
                      label="Average Cost for Two"
                      name="avgCost"
                      value={formData.avgCost}
                      onChange={handleChange}
                    />
                  </FormSection>
                )}

                {/* Step 5: Location & Operations - UPDATED */}
                {step === 5 && (
                  <FormSection title="📍 Location & Operations">
                    <div className="col-span-full">
                      <FormInput
                        label="Complete Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        colSpan
                      />
                    </div>
                    <FormInput
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    
                    {/* State Field - Readonly */}
                    <div>
                      <label className="text-sm font-medium text-cyan-900 block mb-2">
                        State / UT
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state || "West Bengal"}
                        readOnly
                        className="w-full bg-gray-100 border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-700 cursor-not-allowed"
                      />
                    </div>

                    <FormInput
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />

                    {/* Location Picker Component */}
                    <div className="col-span-full">
                      <LocationPicker formData={formData} setFormData={setFormData} />
                    </div>

                    {/* Operational Details */}
                    <div className="col-span-full border-t border-cyan-200 pt-4 mt-4">
                      <h3 className="text-lg font-semibold text-cyan-900 mb-4">
                        🕒 Operational Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput
                          label="Opening Hours"
                          type="time"
                          name="openingHours"
                          value={formData.openingHours}
                          onChange={handleChange}
                        />
                        <FormInput
                          label="Closing Hours"
                          type="time"
                          name="closingHours"
                          value={formData.closingHours}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="text-sm font-medium text-cyan-900 block mb-3">
                          Days Open
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                          {[
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ].map((day) => (
                            <label
                              key={day}
                              className="flex items-center justify-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-cyan-50 transition"
                            >
                              <input
                                type="checkbox"
                                name="daysOpen"
                                value={day}
                                checked={formData.daysOpen.includes(day)}
                                onChange={handleChange}
                                className="accent-cyan-500"
                              />
                              <span className="text-cyan-900 text-sm">
                                {day}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FormSection>
                )}

                {/* Step 6: Bank Details */}
                {step === 6 && (
                  <FormSection title="Bank Details">
                    <FormInput
                      label="Account Holder Name"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                    />
                    <FormInput
                      label="Account Number"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                    />
                    <FormInput
                      label="IFSC Code"
                      name="ifsc"
                      value={formData.ifsc}
                      onChange={handleChange}
                    />
                    <FormInput
                      label="UPI ID (Optional)"
                      name="upi"
                      value={formData.upi}
                      onChange={handleChange}
                    />
                    <div className="col-span-full">
                      <label className="text-sm font-medium text-cyan-900 block mb-2">
                       Scanned Copy of Cancelled Cheque
                      </label>
                      <input
                        type="file"
                        name="bankProof"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 transition"
                      />
                    </div>
                  </FormSection>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 justify-between">
                  {step > 3 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-cyan-200 hover:bg-cyan-50 text-cyan-900 font-medium rounded-lg transition"
                    >
                      <ChevronLeft size={20} /> Previous
                    </button>
                  )}

                  {step < 6 && step >= 3 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-lg transition shadow-md"
                    >
                      Next <ChevronRight size={20} />
                    </button>
                  )}
                  {step === 6 && (
                    <button
                      type="submit"
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
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-t border-cyan-200 bg-white/80 backdrop-blur px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 sm:gap-4 justify-between items-center min-w-max sm:min-w-0 pb-2 sm:pb-0">
            {steps.map((s, i) => {
              const isActive = i + 1 === step;
              const isCompleted = i + 1 < step;

              return (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isCompleted
                        ? "bg-red-500/20 text-red-600 border-2 border-red-500"
                        : isActive
                        ? "bg-cyan-500/30 text-cyan-700 border-2 border-cyan-500"
                        : "bg-white text-cyan-400 border-2 border-cyan-200"
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : i + 1}
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
                    {s}
                  </span>

                  {i < steps.length - 1 && (
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

// Form Section Component
function FormSection({ title, children }) {
  return (
    <div className="bg-cyan-50/50 border-2 border-cyan-200 p-6 rounded-xl space-y-4 animate-fadeIn">
      <h2 className="text-xl font-semibold text-cyan-900">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

// Form Input Component
function FormInput({ label, colSpan = false, ...props }) {
  return (
    <div className={colSpan ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-cyan-900 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-white border-2 border-cyan-200 rounded-lg px-4 py-3 text-cyan-900 placeholder-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition"
      />
    </div>
  );
}

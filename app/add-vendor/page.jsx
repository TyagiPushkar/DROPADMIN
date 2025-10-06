"use client"

import { useState } from "react"
import Cookies from "js-cookie"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"



const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
})
const otpSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
})


export default function AddVendorMultiStep() {
  const [step, setStep] = useState(1) 
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    email:"",
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
    state: "",
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
    email: "",
  });

  const API_URL = "https://namami-infotech.com/DROPRIDER/src/auth/login.php"
  const REGISTER_URL ="https://namami-infotech.com/DROP/src/restaurants/add_restaurant.php"


  
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
  })

  
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
  })

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
        body: JSON.stringify({ identifier: email, otp: data.otp, verify_otp: true }),
      });
      const responseData = await res.json();
      if (responseData.success) {
        Cookies.set("user", JSON.stringify(responseData.data), { expires: 1 });
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
    const { name, value, type, checked, files } = e.target
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }))
    } else if (type === "checkbox") {
      if (name === "cuisines") {
        setFormData((prev) => ({
          ...prev,
          cuisines: checked
            ? [...prev.cuisines, value]
            : prev.cuisines.filter((c) => c !== value),
        }))
      } else if (name === "daysOpen") {
        setFormData((prev) => ({
          ...prev,
          daysOpen: checked
            ? [...prev.daysOpen, value]
            : prev.daysOpen.filter((d) => d !== value),
        }))
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      
      const payload = {
        restaurantName: formData.restaurantName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: email,
        password: formData.phone, 
        type: formData.type,
        cuisines: formData.cuisines,
        avgCost: parseFloat(formData.avgCost) || 0,
        gst: formData.gst,
        gstProof: formData.gstProof ? `uploads/gst/${formData.gstProof.name}` : null,
        fssai: formData.fssai,
        fssaiProof: formData.fssaiProof ? `uploads/fssai/${formData.fssaiProof.name}` : null,
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
        bankProof: formData.bankProof ? `uploads/bank/${formData.bankProof.name}` : null,
        upi: formData.upi,
        description: formData.description || "",
        price_range: formData.price_range || "",
        avg_cost_for_two: parseFloat(formData.avg_cost_for_two) || 0,
      }
  
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
  
      const data = await res.json()
  
      if (!res.ok) throw new Error(data.message || "Failed to submit")
      alert("✅ Vendor registration submitted!")
    } catch (err) {
      console.error(err)
      alert("❌ Something went wrong. Try again!")
    }
  }
  
  const steps = [
    "Email Address",
    "OPT verification",
    "Owner & Basic Info",
    "Restaurant Details",
    "Location and Operation",
    "Bank Details",
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-50 via-pink-50 to-white">

<div className="md:w-1/4 bg-white shadow-xl p-8 flex flex-col items-center gap-8 rounded-2xl">
      
      
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
        <img
          src="/images/droplogo.jpg"
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-xl font-bold text-gray-900 text-center">
        Registration Progress
      </h2>

      
      <div className="relative w-full flex flex-col mt-4">
        
        <div className="absolute left-4 top-0 h-full w-1 bg-gray-200 rounded-full" />
        
        <div
          className="absolute left-4 top-0 w-1 bg-blue-600 rounded-full transition-all duration-500"
          style={{ height: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((s, i) => {
          const isActive = i + 1 === step
          const isCompleted = i + 1 < step

          return (
            <div key={i} className="relative flex items-center gap-3 mb-6">
             
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-semibold shadow-md transition-all duration-300
                  ${isCompleted ? "bg-blue-600 text-white" : isActive ? "bg-blue-100 text-blue-600 border-2 border-blue-600" : "bg-gray-200 text-gray-500"}
                `}
              >
                {i + 1}
              </div>

              
              <span
                className={`text-sm transition-colors duration-300 ${
                  isCompleted
                    ? "text-gray-800 font-medium"
                    : isActive
                    ? "text-blue-700 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {s}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  




      
      <div className="md:w-3/4 flex-1 p-8">
        
        {step === 1 && (
          <form onSubmit={handleEmailSubmit(handleSendOtp)} className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📧 Enter your Email</h2>
            <input
              type="email"
              placeholder="Your email"
              {...registerEmail("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
             {emailErrors.email && (
            <p className="text-red-500 text-sm">{emailErrors.email.message}</p>
          )}
            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        
        {step === 2 && (
          <form  onSubmit={handleOtpSubmit(handleVerifyOtp)} className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔑 Enter OTP</h2>
            <input
              type="text"
              placeholder="6-digit OTP"
              {...registerOtp("otp")}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            {otpErrors.otp && (
            <p className="text-red-500 text-sm">{otpErrors.otp.message}</p>
          )}
            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        
        {step >= 3 && (
          <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto">
            {step === 3 && (
              <Section title="👤 Owner & Basic Information">
                <Input label="Restaurant Name" name="restaurantName" value={formData.restaurantName} onChange={handleChange} />
                <Input label="Owner / Contact Person Name" name="ownerName" value={formData.ownerName} onChange={handleChange} />
                <Input label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </Section>
            )}

            {step === 4 && (
              <Section title="🍽️ Restaurant Details">
                <div>
                  <label className="form-label">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="form-input">
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Cuisines</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["Indian", "Chinese", "Italian", "Mexican", "Fast Food", "Bakery"].map((cuisine) => (
                      <label key={cuisine} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1">
                        <input type="checkbox" name="cuisines" value={cuisine} onChange={handleChange} className="accent-blue-600"/>
                        <span>{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Input label="Average Cost for Two" name="avgCost" value={formData.avgCost} onChange={handleChange} />
                <Input label="GST Number" name="gst" value={formData.gst} onChange={handleChange} />
                <div>
                  <label className="form-label">Upload GST Proof</label>
                  <input type="file" name="gstProof" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="form-input" />
                </div>
                <Input label="FSSAI License Number" name="fssai" value={formData.fssai} onChange={handleChange} />
                <div>
                  <label className="form-label">Upload FSSAI Proof</label>
                  <input type="file" name="fssaiProof" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="form-input" />
                </div>
              </Section>
            )}

            {step === 5 && (
              <Section title="📍 Location & Operational">
                <Input label="Complete Address" name="address" value={formData.address} onChange={handleChange} colSpan />
                <Input label="City" name="city" value={formData.city} onChange={handleChange} />
                <Input label="State" name="state" value={formData.state} onChange={handleChange} />
                <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                <Input label="Google Maps Link" name="mapLink" value={formData.mapLink} onChange={handleChange} colSpan />
                <Section title="🕒 Operational Details">
                  <Input label="Opening Hours" type="time" name="openingHours" value={formData.openingHours} onChange={handleChange} />
                  <Input label="Closing Hours" type="time" name="closingHours" value={formData.closingHours} onChange={handleChange} />
                  <div className="col-span-2">
                    <label className="form-label">Days Open</label>
                    <div className="grid grid-cols-7 gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <label key={day} className="flex items-center gap-2">
                          <input type="checkbox" name="daysOpen" value={day} checked={formData.daysOpen.includes(day)} onChange={handleChange} />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>
                </Section>
              </Section>
            )}

            {step === 6 && (
              <Section title="🏦 Bank Details">
                <Input label="Account Holder Name" name="accountName" value={formData.accountName} onChange={handleChange} />
                <Input label="Bank Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
                <Input label="IFSC Code" name="ifsc" value={formData.ifsc} onChange={handleChange} />
                <Input label="UPI ID (optional)" name="upi" value={formData.upi} onChange={handleChange} />
                <div className="col-span-2">
                  <label className="form-label">Upload Bank Proof</label>
                  <input type="file" name="bankProof" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="form-input" />
                </div>
              </Section>
            )}

            
            <div className="flex justify-between">
              {step > 3 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                  ← Previous
                </button>
              )}
              {step < 6 && step >= 3 && (
                <button type="button" onClick={() => setStep(step + 1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition">
                  Next →
                </button>
              )}
              {step === 6 && (
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 transition">
                  Submit
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}


function Section({ title, children }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <h2 className="col-span-2 text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      {children}
    </div>
  )
}

function Input({ label, colSpan = false, ...props }) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 shadow-sm bg-white"
      />
    </div>
  )
}

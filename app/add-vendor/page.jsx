"use client"

import { useState } from "react"

export default function AddVendorPage() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "Both",
    cuisines: [],
    avgCost: "",
    gst: "",
    fssai: "",
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
    upi: "",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Vendor Data Submitted:", formData)
    alert("Vendor registration submitted!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Restaurant Registration
          </h1>
          <p className="text-blue-100 text-center mt-1">
            Fill in all details carefully to onboard your restaurant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
         
          <Section title="👤 Owner & Basic Information">
            <Input label="Restaurant Name" name="restaurantName" value={formData.restaurantName} onChange={handleChange} />
            <Input label="Owner / Contact Person Name" name="ownerName" value={formData.ownerName} onChange={handleChange} />
            <Input label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
            <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          </Section>

          
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
              <div className="grid grid-cols-2 gap-2">
                {["Indian", "Chinese", "Italian", "Mexican", "Fast Food", "Bakery"].map((cuisine) => (
                  <label key={cuisine} className="flex items-center gap-2">
                    <input type="checkbox" name="cuisines" value={cuisine} onChange={handleChange} />
                    {cuisine}
                  </label>
                ))}
              </div>
            </div>

            <Input label="Average Cost for Two" name="avgCost" value={formData.avgCost} onChange={handleChange} />
            <Input label="GST Number" name="gst" value={formData.gst} onChange={handleChange} />
            <Input label="FSSAI License Number" name="fssai" value={formData.fssai} onChange={handleChange} />
          </Section>

          
          <Section title="📍 Location & Address">
            <Input label="Complete Address" name="address" value={formData.address} onChange={handleChange} colSpan />
            <Input label="City" name="city" value={formData.city} onChange={handleChange} />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} />
            <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
            <Input label="Google Maps Link" name="mapLink" value={formData.mapLink} onChange={handleChange} colSpan />
          </Section>

          
          <Section title="🕒 Operational Details">
            <Input label="Opening Hours" type="time" name="openingHours" value={formData.openingHours} onChange={handleChange} />
            <Input label="Closing Hours" type="time" name="closingHours" value={formData.closingHours} onChange={handleChange} />

            <div className="col-span-2">
              <label className="form-label">Days Open</label>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input type="checkbox" name="daysOpen" value={day}  checked={formData.daysOpen.includes(day)|| false} onChange={handleChange} />
                    {day}
                  </label>
                ))}
              </div>
            </div>

           
          </Section>

          
          <Section title="🏦 Bank Details">
            <Input label="Account Holder Name" name="accountName" value={formData.accountName} onChange={handleChange} />
            <Input label="Bank Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
            <Input label="IFSC Code" name="ifsc" value={formData.ifsc} onChange={handleChange} />
            <Input label="UPI ID (optional)" name="upi" value={formData.upi} onChange={handleChange} />
          </Section>

          
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:opacity-90 transition font-semibold text-lg"
            >
              🚀 Register Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


function Section({ title, children }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
      <h2 className="col-span-2 text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      {children}
    </div>
  )
}

function Input({ label, colSpan = false, ...props }) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <label className="form-label">{label}</label>
      <input {...props} className="form-input" />
    </div>
  )
}


const base = "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 shadow-sm bg-white"
const label = "block text-sm font-medium text-gray-700 mb-1"

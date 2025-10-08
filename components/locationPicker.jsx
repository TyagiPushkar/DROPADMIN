"use client"

import dynamic from "next/dynamic"


const MapWithNoSSR = dynamic(() => import("./mapComponent"), {
  ssr: false, 
})

export default function LocationPicker({ formData, setFormData }) {
  return (
    <div className="col-span-2 mt-4">
      <label className="form-label font-medium">📍 Select Location on Map</label>
      <div className="mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <MapWithNoSSR formData={formData} setFormData={setFormData} />
      </div>

      {formData.mapLink && (
        <p className="mt-2 text-sm text-gray-600">
          Selected Location:{" "}
          <a
            href={formData.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Google Maps
          </a>
        </p>
      )}
    </div>
  )
}

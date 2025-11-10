"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapWithNoSSR = dynamic(() => import("./mapComponent"), {
  ssr: false,
});

export default function LocationPicker({ formData, setFormData }) {
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    async function fetchAddress() {
      if (!formData.location) return;
      const [lat, lon] = formData.location;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await res.json();

        if (data?.display_name) {
          setLocationName(data.display_name);

          setFormData((prev) => ({
            ...prev,
            mapLink: `https://www.google.com/maps?q=${lat},${lon}`,
          }));
        } else {
          setLocationName("Unable to fetch address.");
        }
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
        setLocationName("Error fetching location.");
      }
    }

    fetchAddress();
  }, [formData.location]);

  return (
    <div className="col-span-2 mt-4">
      <label className="form-label font-medium">
        📍 Select Location on Map
      </label>
      <div className="mt-2 rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <MapWithNoSSR formData={formData} setFormData={setFormData} />
      </div>

      {locationName && (
        <p className="mt-2 text-sm text-gray-700">
          <strong>Selected Location:</strong> {locationName}
        </p>
      )}
    </div>
  );
}

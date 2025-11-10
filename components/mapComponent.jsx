"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ formData, setFormData }) {
  const [position, setPosition] = useState(formData.location);

  useEffect(() => {
    if (formData.location) {
      setPosition(formData.location);
    }
  }, [formData.location]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setFormData((prev) => ({ ...prev, location: [lat, lng] }));
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setPosition([lat, lng]);
          setFormData((prev) => ({ ...prev, location: [lat, lng] }));
        },
      }}
    />
  );
}

export default function MapComponent({ formData, setFormData }) {
  const [defaultCenter, setDefaultCenter] = useState([20.5937, 78.9629]);
  useEffect(() => {
    if (formData.location) {
      setDefaultCenter(formData.location);
    }
  }, [formData.location]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker formData={formData} setFormData={setFormData} />
    </MapContainer>
  );
}

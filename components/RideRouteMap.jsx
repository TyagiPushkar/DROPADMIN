"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function RideRouteMap({ selectedRide }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        Ride Route
      </h3>

      <div className="w-full h-72 rounded-xl overflow-hidden">
        <MapContainer
          center={[selectedRide.pickup_lat, selectedRide.pickup_lng]}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full z-10"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Pickup Marker */}
          <Marker
            position={[selectedRide.pickup_lat, selectedRide.pickup_lng]}
            icon={L.icon({
              iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              iconSize: [32, 32],
            })}
          />

          {/* Drop Marker */}
          <Marker
            position={[selectedRide.drop_lat, selectedRide.drop_lng]}
            icon={L.icon({
              iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              iconSize: [32, 32],
            })}
          />

          {/* Route */}
          <Polyline
            positions={[
              [selectedRide.pickup_lat, selectedRide.pickup_lng],
              [selectedRide.drop_lat, selectedRide.drop_lng],
            ]}
            pathOptions={{ color: "blue", weight: 4 }}
          />
        </MapContainer>
      </div>
    </div>
  );
}

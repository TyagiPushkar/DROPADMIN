"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { useState } from "react"
import "leaflet/dist/leaflet.css"


delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

function DraggableMarker({ formData, setFormData }) {
  const [position, setPosition] = useState(formData.location || [20.5937, 78.9629]) 

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng]
      setPosition(newPos)
      setFormData({
        ...formData,
        location: newPos,
        mapLink: `https://www.google.com/maps?q=${newPos[0]},${newPos[1]}`,
      })
    },
  })

  return <Marker position={position} draggable />
}

export default function MapComponent({ formData, setFormData }) {
  return (
    <MapContainer
      center={formData.location || [20.5937, 78.9629]}
      zoom={5}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <DraggableMarker formData={formData} setFormData={setFormData} />
    </MapContainer>
  )
}

"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export default function MapComponent({ formData, setFormData }) {
  const [position, setPosition] = useState(
    formData.latitude && formData.longitude
      ? [formData.latitude, formData.longitude]
      : [20.5937, 78.9629] 
  )

  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          const newPos = [latitude, longitude]
          setPosition(newPos)
          setFormData({
            ...formData,
            latitude,
            longitude,
          })
          setMapReady(true)
        },
        () => setMapReady(true)
      )
    } else {
      setMapReady(true)
    }
  }, [])

  function LocationEvents() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setPosition([lat, lng])
        setFormData({
          ...formData,
          latitude: lat,
          longitude: lng,
        })
      },
    })
    return null
  }

  if (!mapReady) return <p className="p-4 text-gray-500">Detecting your location...</p>

  return (
    <MapContainer center={position} zoom={14} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {position && (
        <Marker
          position={position}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target
              const { lat, lng } = marker.getLatLng()
              setPosition([lat, lng])
              setFormData({
                ...formData,
                latitude: lat,
                longitude: lng,
              })
            },
          }}
        />
      )}

      <LocationEvents />
    </MapContainer>
  )
}

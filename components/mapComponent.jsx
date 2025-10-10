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
  const [position, setPosition] = useState(formData.location || [20.5937, 78.9629]) 
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
            location: newPos,
            mapLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
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
        const newPos = [e.latlng.lat, e.latlng.lng]
        setPosition(newPos)
        setFormData({
          ...formData,
          location: newPos,
          mapLink: `https://www.google.com/maps?q=${newPos[0]},${newPos[1]}`,
        })
      },
    })
    return null
  }

  if (!mapReady) return <p className="p-4 text-gray-500">Detecting your location...</p>

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker
        position={position}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target
            const newPos = [marker.getLatLng().lat, marker.getLatLng().lng]
            setPosition(newPos)
            setFormData({
              ...formData,
              location: newPos,
              mapLink: `https://www.google.com/maps?q=${newPos[0]},${newPos[1]}`,
            })
          },
        }}
      />
      <LocationEvents />
    </MapContainer>
  )
}

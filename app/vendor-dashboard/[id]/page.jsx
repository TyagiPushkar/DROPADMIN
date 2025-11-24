"use client"

import { useState } from "react"
import Sidebar from "./components/sidebar"
import Navbar from "./components/navbar"
import { useParams } from "next/navigation"
import { OrderModalProvider } from "./components/orderModalProvider"

export default function DashboardHome() {
  const { id } = useParams()
  const [open, setOpen] = useState(false)

  return (
    <OrderModalProvider>
    <div className="flex min-h-screen bg-green-100">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex-col">
      <Navbar setOpen={setOpen} />

      <h1 className="text-2xl font-bold">Welcome Restaurant #{id}</h1>
      </div>
      
      

     
    </div> </OrderModalProvider>
  )
}

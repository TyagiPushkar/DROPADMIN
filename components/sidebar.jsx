"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  Settings,
  X,
  Bike,
  Wallet,
  Book,
  ChevronRight,
  Home,
  Shield,
  Calculator,
  IndianRupee
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/analytics", icon: Home, badge: null },
  { name: "Orders", href: "/orders", icon: ShoppingCart, badge: null },
  { name: "Vendors", href: "/vendors", icon: Package, badge: null },
  { name: "Riders", href: "/riders", icon: Users, badge: null },
  { name: "Rides", href: "/rides", icon: Bike, badge: null },
  { name: "Wallet", href: "/rider-ledger", icon: Wallet, badge: null },
  { name: "Fares", href: "/fares", icon: Calculator, badge: null },
  { name: "Settings", href: "/settings", icon: Settings, badge: null },
  { name: "Transactions", href: "/transactions", icon: IndianRupee, badge: null },
];

export default function Sidebar({ open, setOpen }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-65 flex flex-col z-50
          transform transition-all duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
        style={{
          background: "linear-gradient(180deg, #0A2540 0%, #1A365D 100%)",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <img
                  src="/images/droplogo.jpg"
                  alt="DROP"
                  className="w-10 h-10"
                />
              </div>
              <div>
                <h1 className="font-bold text-2xl text-white tracking-tight">
                  Drop
                </h1>
                <p className="text-xs text-cyan-200/70 font-medium">
                  Admin Portal
                </p>
              </div>
            </div>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation with custom scrollbar */}
        <nav
          className="flex-1 mt-2 p-4 overflow-y-auto 
          [&::-webkit-scrollbar]:w-[5px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-white/10
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-white/20
          [&::-webkit-scrollbar]:hidden
          scrollbar-width: thin
          scrollbar-color: rgba(255,255,255,0.1) transparent
          hover:[&::-webkit-scrollbar]:block"
        >
          <div className="mb-6">
            <p className="text-xs uppercase text-white/50 font-semibold tracking-wider px-4 mb-3">
              Main Menu
            </p>
            {menuItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group relative flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-white border-l-4 border-cyan-400 shadow-lg"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-cyan-500/20"
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-cyan-300" : "text-white/70"
                        }`}
                      />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-cyan-500 text-white"
                            : "bg-white/10 text-white/90"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        isActive
                          ? "rotate-90"
                          : "opacity-0 group-hover:opacity-50"
                      }`}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mb-6">
            <p className="text-xs uppercase text-white/50 font-semibold tracking-wider px-4 mb-3">
              Management
            </p>
            {menuItems.slice(5).map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group relative flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-white border-l-4 border-cyan-400 shadow-lg"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-cyan-500/20"
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-cyan-300" : "text-white/70"
                        }`}
                      />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isActive
                        ? "rotate-90"
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Status Card */}
          {/* <div className="mt-8 mx-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">System Status</span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            </div>
            <div className="text-xs text-white/50">
              Last updated: Today 10:30 AM
            </div>
          </div> */}
        </nav>
      </aside>
    </>
  );
}

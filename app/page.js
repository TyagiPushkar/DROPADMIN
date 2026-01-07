'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';

export default function Home() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration issue by using useEffect
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Don't render anything on server to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="text-center">
            {/* Fixed: No div inside p tags */}
            <div className="h-12 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mx-auto mb-6"></div>
            <div className="h-6 w-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-gray-100">
      <Navbar currentPath={pathname} />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Fast. Reliable. Delivered with{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                DROP
              </span>
            </h1>
            <div className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your all-in-one delivery platform designed to make everyday transport and food delivery simple,
              fast, and affordable.
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <span className="text-2xl font-bold text-white">24/7</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Always Available</h3>
              <div className="text-gray-600">Round-the-clock service for your convenience</div>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Tracking</h3>
              <div className="text-gray-600">Track your deliveries every step of the way</div>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <span className="text-2xl font-bold text-white">1000+</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Trusted Riders</h3>
              <div className="text-gray-600">Professional delivery partners across town</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-500/10 p-8 md:p-12 mb-12 border border-gray-200/60">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-12 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-4"></div>
                Experience Seamless Delivery
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <div>
                  Whether you're craving your favorite meal or need items delivered across town,
                  DROP connects you with trusted independent riders who get the job done—on time, every time.
                </div>
                <div>
                  With just a few taps, customers can place orders, track deliveries in real time, and enjoy seamless
                  service. Restaurants grow their reach, riders earn on their own terms, and customers enjoy convenience
                  like never before.
                </div>
                <div className="pt-6 border-t border-gray-200/60">
                  <div className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">
                    DROP it. Track it. Receive it.
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-2xl"></div>
              <button className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300 active:scale-95">
                Start Delivering with DROP
              </button>
              <div className="text-gray-500 mt-6">Join thousands of satisfied customers today</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export const BASE_URL = "https://namami-infotech.com/DROP/src/";
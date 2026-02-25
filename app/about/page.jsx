'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';

export default function About() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-gray-100">
      <Navbar currentPath={pathname} />
      
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              About <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">DROP</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-12"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learn about our mission, vision, and what drives us to deliver exceptional service every day.
            </p>
          </div>

          {/* Who We Are Section - Full Width */}
          <div className="relative group mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-500/10 p-8 md:p-12 border border-gray-200/60">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Who We Are</h2>
              </div>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <div>
                  DROP is a technology-driven delivery platform built to bridge the gap between customers, restaurants,
                  and independent drivers. Our goal is to simplify delivery services while creating opportunities for local
                  businesses and drivers to thrive.
                </div>
                <div>
                  We believe delivery should be fast, transparent, and accessible to everyone. By leveraging smart
                  technology, DROP empowers customers to order with confidence, restaurants to expand their business,
                  and drivers to work independently with flexibility.
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision Sections - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Our Mission */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-500/10 p-8 border border-blue-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <div className="text-gray-700 text-lg leading-relaxed">
                  <div className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">
                    To create a reliable, efficient, and inclusive delivery ecosystem that benefits customers, businesses, and riders alike.
                  </div>
                </div>
              </div>
            </div>

            {/* Our Vision */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-500/10 p-8 border border-blue-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <div className="text-gray-700 text-lg leading-relaxed">
                  <div className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">
                    To become a trusted everyday delivery partner, transforming how people move goods and enjoy food through innovation and convenience.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline Section */}
          <div className="text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-2xl"></div>
            <div className="relative inline-block">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                DROP it. Track it. Receive it.
              </div>
              <div className="text-gray-600 text-lg">
                Delivering smiles, one package at a time
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
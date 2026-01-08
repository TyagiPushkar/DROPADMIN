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
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Hero Image/Content */}
          <div className="relative mb-16 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            <div className="relative bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-500/10 border border-blue-200/60">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Building Connections, Delivering Happiness
                  </h2>
                  <div className="text-lg text-gray-700 leading-relaxed">
                    DROP is more than just a delivery service - we're a community platform that connects 
                    people with their favorite foods and essential items through a network of trusted riders.
                  </div>
                </div>
                <div className="md:w-1/3">
                  <div className="relative group/year">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm group-hover/year:blur-md transition-all duration-300"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-gray-200/60">
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">2023</div>
                      <div className="text-gray-700">Founded with a vision</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Who We Are */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
                </div>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <div>
                    DROP is a technology-driven delivery platform built to bridge the gap between customers, restaurants,
                    and independent riders. Our goal is to simplify delivery services while creating opportunities for local
                    businesses and riders to thrive.
                  </div>
                  <div>
                    We believe delivery should be fast, transparent, and accessible to everyone. By leveraging smart
                    technology, DROP empowers customers to order with confidence, restaurants to expand their business,
                    and riders to work independently with flexibility.
                  </div>
                </div>
              </div>
            </div>

            {/* Our Mission */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-500/10 p-8 border border-gray-200/60">
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
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <div className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic mb-4">
                    To create a reliable, efficient, and inclusive delivery ecosystem that benefits customers, businesses, and riders alike.
                  </div>
                  <div className="relative group/mission">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl blur-sm group-hover/mission:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-blue-50/80 to-purple-50/80 p-6 rounded-xl border border-blue-200/40">
                      <ul className="space-y-3">
                        {[
                          "Empower local businesses with expanded reach",
                          "Provide flexible earning opportunities for riders",
                          "Deliver unparalleled convenience to customers"
                        ].map((item, index) => (
                          <li key={index} className="flex items-center group/item">
                            <div className="relative w-5 h-5 mr-2">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-sm group-hover/item:blur-md transition-all duration-300"></div>
                              <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Vision */}
          <div className="relative mb-16 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900 via-blue-900/90 to-purple-900/90 rounded-3xl shadow-2xl p-8 md:p-12 text-white border border-blue-700/30">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
                  <div className="relative w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mr-6 shadow-md">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">Our Vision</h2>
              </div>
              <div className="space-y-6 text-lg leading-relaxed">
                <div className="relative group/vision">
                  <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover/vision:blur-md transition-all duration-300"></div>
                  <div className="relative bg-white/10 p-6 rounded-xl border border-white/10">
                    <div className="text-2xl font-semibold mb-2">
                      To become a trusted everyday delivery partner, transforming how people move goods and enjoy food through innovation and convenience.
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group/feature">
                    <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover/feature:blur-md transition-all duration-300"></div>
                    <div className="relative bg-white/10 p-6 rounded-xl border border-white/10">
                      <h3 className="text-xl font-semibold mb-3">Innovation Driven</h3>
                      <div>Continuously improving technology for better user experiences</div>
                    </div>
                  </div>
                  <div className="relative group/feature">
                    <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover/feature:blur-md transition-all duration-300"></div>
                    <div className="relative bg-white/10 p-6 rounded-xl border border-white/10">
                      <h3 className="text-xl font-semibold mb-3">Community Focused</h3>
                      <div>Building strong relationships with local businesses and riders</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-16">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  title: "Speed & Reliability",
                  description: "Delivering on time, every time with consistent service"
                },
                {
                  icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
                  title: "Transparency",
                  description: "Clear communication and honest practices throughout"
                },
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title: "Trust & Security",
                  description: "Safe and secure transactions for all parties involved"
                }
              ].map((value, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group-hover:-translate-y-2">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{value.title}</h3>
                    <div className="text-gray-600 text-center">{value.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-2xl"></div>
            <div className="relative inline-block">
              <button className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300 active:scale-95">
                Join the DROP Community
              </button>
              <div className="text-gray-500 mt-4">Be part of the delivery revolution</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
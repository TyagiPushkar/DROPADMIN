'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';

export default function PrivacyPage() {
  const pathname = usePathname();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-gray-100">
      <Navbar currentPath={pathname} />
      
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <div className="text-gray-600 text-lg mb-2">
              Last Updated: {currentDate}
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Introduction Section */}
          <div className="relative group mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-sm"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-500/10 p-8 md:p-10 border border-gray-200/60">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <div>
                  This Privacy Policy describes how Drop, owned and operated by Drop In Express OPC (Pvt.) Ltd., having
                  its registered office at 43, Karaya Road, Kolkata -700017, West Bengal, India, collects, uses, shares, and
                  protects personal data of users, who access or use our mobile application and related services for
                  customer transport and food delivery.
                </div>
                <div className="relative mt-6 p-6 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-xl border border-blue-200/40">
                  <h3 className="font-semibold text-gray-800 mb-3">Published in compliance with:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>The Information Technology Act, 2000</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>The Digital Personal Data Protection Act, 2023 (DPDP Act)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Section 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      1
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">Information We Collect</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">1.1 Personal Information</h3>
                    <div className="text-gray-700">
                      We may collect the following personal data:
                    </div>
                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      {['Full name', 'Mobile number', 'Email address', 'Profile photo', 'Government-issued ID (where required for driver/partner verification)'].map((item, idx) => (
                        <div key={idx} className="flex items-center p-3 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-lg border border-gray-200/60">
                          <div className="w-2 h-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mr-3"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">1.2 Location Data</h3>
                    <ul className="space-y-2 text-gray-700 ml-5">
                      {[
                        "Real-time GPS location for ride booking, navigation, delivery tracking, and fraud prevention",
                        "Pickup and drop-off addresses",
                        "Saved addresses"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-2">a.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">1.3 Transaction Information</h3>
                    <ul className="space-y-2 text-gray-700 ml-5">
                      {[
                        "Ride and order history",
                        "Payment details (processed via secure third-party payment gateways)",
                        "Invoices and receipts"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-2">a.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">1.4 Device and Technical Information</h3>
                    <ul className="space-y-2 text-gray-700 ml-5">
                      {[
                        "IP address",
                        "Device type, operating system, app version",
                        "Log data and crash reports"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-2">a.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">1.5 Partner Information</h3>
                    <div className="text-gray-700 mb-3">For drivers and delivery partners:</div>
                    <ul className="space-y-2 text-gray-700 ml-5">
                      {[
                        "Driving license details",
                        "Vehicle information",
                        "Bank account details",
                        "Background verification data"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-2">{String.fromCharCode(97 + idx)}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      2
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">How We Use Your Information</h2>
                </div>
                
                <div className="text-gray-700 mb-4">
                  We use your information to:
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Provide ride-hailing and food delivery services",
                    "Match customers with drivers or delivery partners",
                    "Process payments and refunds",
                    "Enable real-time tracking and navigation",
                    "Improve app functionality and user experience",
                    "Communicate service updates, offers, and support messages",
                    "Prevent fraud and ensure safety",
                    "Comply with legal and regulatory requirements"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-lg border border-blue-200/40">
                      <span className="text-blue-600 mr-2 font-medium">{String.fromCharCode(97 + idx)}.</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      3
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">Sharing of Information</h2>
                </div>
                
                <div className="text-gray-700 mb-4">
                  We may share your information with:
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Drivers and delivery partners to fulfill bookings",
                    "Restaurants and merchants for order preparation and delivery",
                    "Payment gateways and financial institutions for secure transactions",
                    "Third-party service providers (cloud hosting, analytics, customer support)",
                    "Government or law enforcement authorities when required by law"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-lg border border-gray-200/60">
                      <span className="text-blue-600 mr-2 font-medium">{String.fromCharCode(97 + idx)}.</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50/80 to-emerald-50/80 rounded-lg border border-green-200/60">
                  <div className="flex items-center text-green-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-semibold">We do not sell your personal data to third parties.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      4
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">Data Retention</h2>
                </div>
                
                <div className="text-gray-700 mb-4">
                  We retain personal data only for as long as necessary to:
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Provide services",
                    "Comply with legal obligations",
                    "Resolve disputes",
                    "Enforce agreements"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-lg border border-gray-200/60">
                      <span className="text-blue-600 mr-2 font-medium">{String.fromCharCode(97 + idx)}.</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="text-gray-700 p-4 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-lg border border-blue-200/40">
                  Data may be anonymized or deleted after the retention period.
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      5
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">Your Rights</h2>
                </div>
                
                <div className="text-gray-700 mb-4">
                  Subject to applicable Indian laws, you have the right to:
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Access your personal data",
                    "Request correction or updating of data",
                    "Withdraw consent (where applicable)",
                    "Request deletion of personal data",
                    "Register a grievance or complaint"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-lg border border-blue-200/40">
                      <span className="text-blue-600 mr-2 font-medium">{String.fromCharCode(97 + idx)}.</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="text-gray-700 p-4 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-lg border border-gray-200/60">
                  Requests can be made by contacting us using the details below.
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      6
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">Data Security</h2>
                </div>
                
                <div className="text-gray-700 mb-4">
                We implement reasonable security practices, including:
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Encryption of sensitive data",
                    "Secure servers and access controls",
                    "Regular security audits"
                  
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-lg border border-blue-200/40">
                      <span className="text-blue-600 mr-2 font-medium">{String.fromCharCode(97 + idx)}.</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="text-gray-700 p-4 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-lg border border-gray-200/60">
                Despite best efforts, no system is completely secure.
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      7
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">Cookies and Tracking Technologies</h2>
                </div>
                
                <div className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Maintain user sessions",
                    "Analyze app performance",
                    "Improve service delivery"
                   
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-lg border border-blue-200/40">
                      <span className="text-blue-600 mr-2 font-medium">{String.fromCharCode(97 + idx)}.</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="text-gray-700 p-4 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-lg border border-gray-200/60">
                You may control cookies through device settings.
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      8
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">Children’s Privacy</h2>
                </div>
                
                <div className="text-gray-700 mb-4">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect
personal data from minors.
                </div>
               
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      9
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">Third-Party Links</h2>
                </div>
                
                <div className="text-gray-700 mb-4">
                Our app may contain links to third-party websites or services. We are not responsible for their privacy
practices.
                </div>
               
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      10
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">Changes to This Privacy Policy</h2>
                </div>
                
                <div className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. Changes will be notified through the app or
website. Continued use of services constitutes acceptance of the revised policy.
                </div>
               
              </div>
            </div>

            <div className="relative group">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/10 p-8 border border-gray-200/60">
    <div className="flex items-center mb-8">
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
        <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          11
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 ml-5">
        Grievance Officer / Contact Information
      </h2>
    </div>
    
    <div className="space-y-6">
      <div className="text-gray-700 text-lg leading-relaxed">
        In accordance with Indian law, the Grievance Officer details are:
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="w-32 flex-shrink-0">
            <span className="font-semibold text-gray-800">Name:</span>
          </div>
          <div className="flex-1 p-3 bg-gradient-to-br from-gray-50 to-white/80 rounded-lg border border-gray-200/60">
            <span className="text-gray-700">[Grievance Officer Name]</span>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="w-32 flex-shrink-0">
            <span className="font-semibold text-gray-800">Email:</span>
          </div>
          <div className="flex-1 p-3 bg-gradient-to-br from-gray-50 to-white/80 rounded-lg border border-gray-200/60">
            <a href="mailto:support@appname.com" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
              support@appname.com
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="w-32 flex-shrink-0">
            <span className="font-semibold text-gray-800">Address:</span>
          </div>
          <div className="flex-1 p-3 bg-gradient-to-br from-gray-50 to-white/80 rounded-lg border border-gray-200/60">
            <span className="text-gray-700">43, Karaya Road, Kolkata -700017, West Bengal, India</span>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="w-32 flex-shrink-0">
            <span className="font-semibold text-gray-800">Response Time:</span>
          </div>
          <div className="flex-1 p-3 bg-gradient-to-br from-green-50 to-emerald-50/80 rounded-lg border border-green-200/60">
            <div className="flex items-center text-green-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">Within 7 working days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
           
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
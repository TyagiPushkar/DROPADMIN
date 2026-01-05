"use client"
import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
                <p className="text-xs text-gray-500">DROP IN EXPRESS OPC Pvt Ltd</p>
              </div>
            </div>

            <Link 
              href="/" 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Privacy Policy Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Privacy Policy
            </h2>
            <p className="text-gray-600">
              Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-gray-600 mt-4">
              This Privacy Policy describes how Drop, owned and operated by Drop In Express OPC (Pvt.) Ltd., having
              its registered office at 43, Karaya Road, Kolkata -700017, West Bengal, India, collects, uses, shares, and
              protects personal data of users, who access or use our mobile application and related services for
              customer transport and food delivery.
            </p>
            <p className="text-gray-600 mt-4">
              This Privacy Policy is published in compliance with:
            </p>
            <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1">
              <li>The Information Technology Act, 2000</li>
              <li>The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
              <li>The Digital Personal Data Protection Act, 2023 (DPDP Act)</li>
            </ul>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">1</span>
                1. Information We Collect
              </h3>
              
              <div className="ml-11 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1.1 Personal Information</h4>
                  <p className="text-gray-600 mb-3">We may collect the following personal data:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Full name</li>
                    <li>Mobile number</li>
                    <li>Email address</li>
                    <li>Profile photo</li>
                    <li>Government-issued ID (where required for driver/partner verification)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1.2 Location Data</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Real-time GPS location for ride booking, navigation, delivery tracking, and fraud prevention</li>
                    <li>Pickup and drop-off addresses</li>
                    <li>Saved addresses</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1.3 Transaction Information</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Ride and order history</li>
                    <li>Payment details (processed via secure third-party payment gateways)</li>
                    <li>Invoices and receipts</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1.4 Device and Technical Information</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>IP address</li>
                    <li>Device type, operating system, app version</li>
                    <li>Log data and crash reports</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1.5 Partner Information</h4>
                  <p className="text-gray-600 mb-3">For drivers and delivery partners:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Driving license details</li>
                    <li>Vehicle information</li>
                    <li>Bank account details</li>
                    <li>Background verification data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">2</span>
                2. How We Use Your Information
              </h3>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">We use your information to:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Provide ride-hailing and food delivery services</li>
                  <li>Match customers with drivers or delivery partners</li>
                  <li>Process payments and refunds</li>
                  <li>Enable real-time tracking and navigation</li>
                  <li>Improve app functionality and user experience</li>
                  <li>Communicate service updates, offers, and support messages</li>
                  <li>Prevent fraud and ensure safety</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">3</span>
                3. Sharing of Information
              </h3>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">We may share your information with:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Drivers and delivery partners to fulfill bookings</li>
                  <li>Restaurants and merchants for order preparation and delivery</li>
                  <li>Payment gateways and financial institutions for secure transactions</li>
                  <li>Third-party service providers (cloud hosting, analytics, customer support)</li>
                  <li>Government or law enforcement authorities when required by law</li>
                </ul>
                <p className="text-gray-600 mt-4 font-medium">
                  We do not sell your personal data to third parties.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">4</span>
                4. Data Retention
              </h3>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">We retain personal data only for as long as necessary to:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Provide services</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce agreements</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Data may be anonymized or deleted after the retention period.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">5</span>
                5. Your Rights
              </h3>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">
                  Subject to applicable Indian laws, you have the right to:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Access your personal data</li>
                  <li>Request correction or updating of data</li>
                  <li>Withdraw consent (where applicable)</li>
                  <li>Request deletion of personal data</li>
                  <li>Register a grievance or complaint</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Requests can be made by contacting us using the details below.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">6</span>
                6. Data Security
              </h3>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">We implement reasonable security practices, including:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Secure servers and access controls</li>
                  <li>Regular security audits</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Despite best efforts, no system is completely secure.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">7</span>
                7. Cookies and Tracking Technologies
              </h3>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Maintain user sessions</li>
                  <li>Analyze app performance</li>
                  <li>Improve service delivery</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  You may control cookies through device settings.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">8</span>
                8. Children's Privacy
              </h3>
              <div className="ml-11">
                <p className="text-gray-600">
                  Our services are not intended for individuals under 18 years of age. We do not knowingly collect
                  personal data from minors.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">9</span>
                9. Third-Party Links
              </h3>
              <div className="ml-11">
                <p className="text-gray-600">
                  Our app may contain links to third-party websites or services. We are not responsible for their privacy
                  practices.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">10</span>
                10. Changes to This Privacy Policy
              </h3>
              <div className="ml-11">
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. Changes will be notified through the app or
                  website. Continued use of services constitutes acceptance of the revised policy.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">11</span>
                11. Grievance Officer / Contact Information
              </h3>
              <div className="ml-11">
                <p className="text-gray-600 mb-4">
                  In accordance with Indian law, the Grievance Officer details are:
                </p>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="text-gray-600 ml-2">[Grievance Officer Name]</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-600 ml-2">[support@appname.com]</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Address:</span>
                      <span className="text-gray-600 ml-2">43, Karaya Road, Kolkata -700017, West Bengal, India</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Response Time:</span>
                      <span className="text-gray-600 ml-2">Within 7 working days</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-900">DROP IN EXPRESS OPC Pvt Ltd</h4>
                <p className="text-gray-600 text-sm mt-1">
                  43, Karaya Road, Kolkata -700017, West Bengal, India
                </p>
              </div>
              <Link 
                href="/" 
                className="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';
import { useState, useEffect } from 'react';

export default function Terms() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('definitions');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sections = [
    {
      id: 'definitions',
      title: "Definitions",
      content: [
        { term: "App", definition: "means the mobile application." },
        { term: "Company, We, Us, Our", definition: "refers to DROP IN EXPRESS OPC Pvt Ltd." },
        { term: "User", definition: "refers to passengers, food customers, drivers, delivery partners, or any person using the Services." },
        { term: "Driver", definition: "refers to a bike rider registered on the platform to provide ride or delivery services." },
        { term: "Customer", definition: "refers to passengers and food delivery customers." }
      ]
    },
    {
      id: 'summary',
      title: "Summary of Business Operating Model",
      content: [
        "DROP IN EXPRESS OPC Pvt Ltd is the principal of the brand DROP.",
        "Drop offers a B2C platform giving business with a pre-paid fee of Rs.5/- Plus GST for purchase of every unit of ride taken by bike.",
        "Drop is not accepting any money from driver or from his/her customer. So drop is not liable for any financial dispute between driver and customer.",
        "In case of any misconduct of driver or customer, drop will not take any responsibility for the misconduct.",
        "In case of any accident/death, insurance provider of the driver will be responsible for compensation. Drop will not be liable for any financial liability for the same.",
        "In case of food delivery, drop is not liable for any quality of food supplied by restaurant.",
        "Restaurant is fully liable for any quality and quantity of food supplied.",
        "In case of food delivery, mis-conduct of driver, restaurant, customer/s among themselves etc. drop will not take any responsibility.",
        "Drop has the right to give all the information to Government authorities, in reply to whatever is asked for.",
        "DROP does not have any responsibility in case there is a difference found in the registration number of the vehicle, which has appeared in the Apps while booking and the one, which has actually reached the customer during the ride."
      ]
    },
    {
      id: 'eligibility',
      title: "Eligibility of Bike Driver",
      content: [
        "You must be at least 18 years old to use the Services.",
        "Drivers must hold a valid driving license, vehicle registration, insurance, and any permits required under Indian law.",
        "DROP does not have a responsibility regarding the veracity of the Driver's License, AADHAR Number & details of RC (Smart Card) of each Driver.",
        "By using the App, you represent that you are legally competent to enter into a binding contract under the Indian Contract Act, 1872."
      ]
    },
    {
      id: 'scope',
      title: "Scope of Services",
      content: [
        "The Company provides a technology platform to connect drivers with customers for:",
        "• Bike taxi / passenger transportation",
        "• Food delivery services",
        "The Company does not own, operate, or control vehicles and is not a transportation provider."
      ]
    },
    {
      id: 'account',
      title: "Account Registration",
      content: [
        "Users must provide accurate and complete information during registration.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "The Company reserves the right to suspend or terminate accounts providing false or misleading information."
      ]
    },
    {
      id: 'payments',
      title: "Bookings and Payments",
      content: [
        "Fares, delivery charges, and applicable taxes will be displayed before confirmation.",
        "Payments may be made via UPI, cards, wallets, or other approved payment methods.",
        "The Company may charge a platform/service fee.",
        "All payments are processed through third-party payment gateways in compliance with RBI guidelines."
      ]
    },
    {
      id: 'cancellations',
      title: "Cancellations and Refunds",
      content: [
        {
          type: "restaurant",
          title: "Restaurant/Food Delivery",
          letter: "A",
          policyHeader: "This Refund and Cancellation Policy ('Policy') governs the cancellation of orders and issuance of refunds for food delivery services provided through the DROP mobile application and related platforms. By placing an order on the Platform, the customer ('User') agrees to be bound by this Policy.",
          
          
          subsections: [
            {
              title: "1. Customer-Initiated Cancellation",
              items: [
                "• Cancellation Prior to Order Acceptance: A User may cancel an order without penalty only until the restaurant accepts the order. In such cases, DROP shall process a full refund to the original mode of payment.",
                "• Cancellation After Order Acceptance: Once the restaurant has accepted the order and commenced preparation, customer-initiated cancellation shall not be eligible for any refund, whether in full or in part.",
                "• Cancellation After Dispatch: If the order has been picked up by the delivery partner or is en route to the delivery address, cancellation by the User shall result in no refund, under any circumstances."
              ]
            },
            {
              title: "2. Non-Refundable Circumstances",
              items: [
                "Refunds shall not be issued where cancellation or failure of delivery arises due to any of the following circumstances attributable to the User:",
                "• Change of mind after order confirmation",
                "• Incorrect order placement by the User",
                "• Incorrect or incomplete delivery address provided by the User",
                "• Non-availability, inaccessibility, or non-responsiveness of the User at the time of delivery",
                "• Refusal to accept delivery at the designated location"
              ]
            },
            {
              title: "3. Cancellation or Refund Due to DROP or Restaurant Fault",
              items: [
                "DROP may, at its sole discretion, issue a full or partial refund if:",
                "• The order is cancelled due to technical or operational issues attributable to DROP",
                "• The restaurant is unable to prepare or fulfill the order",
                "• There is a substantial delay caused by DROP or its delivery partners",
                "• Items delivered are missing or incorrect due to restaurant error, subject to verification"
              ]
            },
            {
              title: "4. Refund Processing",
              items: [
                "• All approved refunds shall be processed to the original payment method used at the time of placing the order.",
                "• Refunds may take five (5) to ten (10) business days to reflect, depending on the User's bank or payment service provider. DROP shall not be liable for delays caused by third-party financial institutions."
              ]
            },
            {
              title: "5. Finality of Decision",
              items: [
                "• All decisions regarding refunds and cancellations shall be made by DROP in accordance with this Policy and shall be final and binding."
              ]
            },
            {
              title: "6. Amendments",
              items: [
                "• DROP reserves the right to modify or amend this Policy at any time without prior notice. Continued use of the Platform after such modifications, would constitute acceptance of the revised Policy."
              ]
            }
          ]
        },
        {
          type: "bikes",
          title: "Bike Services",
          letter: "B",
          policyHeader: "This Refund and Cancellation Policy ('Policy') governs cancellations and refunds in relation to services facilitated through the DROP mobile application and related platforms. DROP operates solely as a technology aggregator, connecting customers ('Users') with independent bike riders/drivers ('Drivers'), and does not collect any ride or delivery charges from Users.\nBy using the Platform, Users and Drivers agree to be bound by this Policy.",
          subsections: [
            {
              title: "1. Nature of Payments",
              items: [
                "• DROP does not collect, process, or hold any payments from Users for rides or deliveries.",
                "• All service charges are paid directly by the User to the Driver, using cash or any mutually agreed payment method.",
                "• DROP charges a platform usage fee solely to Drivers and has no control over amounts collected from Users."
              ]
            },
            {
              title: "2. Customer-Initiated Cancellation",
              items: [
                "• Cancellation Before Ride/Delivery Commencement: User may cancel a booking at any time before the Driver arrives or before the service has commenced, without any refund obligation on DROP, as no payment is collected by DROP.",
                "• Cancellation After Service Commencement: If the User cancels after the Driver has arrived or after the service has commenced, any charges, if applicable, shall be settled directly between the User and the Driver. DROP shall not be responsible for any refund, adjustment, or compensation."
              ]
            },
            {
              title: "3. Refund Responsibility",
              items: [
                "• Since DROP does not receive payments from Users, DROP shall not issue refunds under any circumstances.",
                "• Any dispute regarding fare, overcharging, or refund shall be resolved directly between the User and the Driver.",
                "• DROP shall not be liable for any cash or digital payments exchanged between Users and Drivers."
              ]
            },
            {
              title: "4. Driver Cancellations and Service Issues",
              items: [
                "• In the event a Driver cancels the booking or fails to provide the service, no refund shall be due from DROP, as no payment is collected by DROP.",
                "• DROP may, at its discretion, take platform-level action against the Driver in accordance with its internal policies but shall have no financial liability toward the User."
              ]
            },
            {
              title: "5. Limitation of Liability",
              items: [
                "DROP acts solely as an intermediary and shall not be liable for:",
                "• Refunds, fare disputes, or payment disagreements between Users and Drivers",
                "• Loss, damage, or disputes arising from cash or direct digital payments",
                "• Any claims arising from cancellation or non-completion of service"
              ]
            },
            {
              title: "6. Amendments",
              items: [
                "• DROP reserves the right to amend or modify this Policy at any time without prior notice. Continued use of the Platform constitutes acceptance of the revised Policy."
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'driver-obligations',
      title: "Driver Obligations",
      content: [
        "Drivers agree to:",
        "• Comply with all applicable Motor Vehicles Act, 1988 and traffic laws",
        "• Maintain vehicle safety and cleanliness",
        "• Behave professionally and respectfully",
        "• Not engage in unlawful, abusive, or unsafe conduct",
        "• Complete rides or deliveries once accepted unless justified"
      ]
    },
    {
      id: 'user-conduct',
      title: "User Conduct",
      content: [
        "Users shall not:",
        "• Misuse the App for illegal or fraudulent activities",
        "• Harass, abuse, or threaten drivers or customers",
        "• Damage vehicles or delivery items",
        "• Provide false information",
        "• Attempt to bypass the platform's payment system"
      ]
    },
    {
      id: 'food-delivery',
      title: "Food Delivery",
      content: [
        "Food quality, preparation, and hygiene are the responsibility of the restaurant/merchant.",
        "The Company is not responsible for food quality but will facilitate issue resolution.",
        "Delivery times are estimates and may vary due to traffic or other factors."
      ]
    },
    {
      id: 'ratings',
      title: "Ratings and Reviews",
      content: [
        "Users may provide ratings and feedback.",
        "The Company reserves the right to remove inappropriate or misleading reviews."
      ]
    },
    {
      id: 'safety',
      title: "Safety and Liability",
      content: [
        "The Company does not guarantee uninterrupted or error-free Services.",
        "Users acknowledge inherent risks in transportation and delivery services.",
        "The Company is not liable for:",
        "• Acts or omissions of drivers or users",
        "• Loss of personal belongings",
        "• Delays due to weather, traffic, or force majeure"
      ]
    },
    {
      id: 'insurance',
      title: "Insurance",
      content: [
        "Drivers are responsible for maintaining valid vehicle insurance as per Indian law."
      ]
    },
    {
      id: 'ip',
      title: "Intellectual Property",
      content: [
        "All contents, trademarks, logos, and software are owned by the Company.",
        "Users may not copy, modify, distribute, or exploit any content without permission."
      ]
    },
    {
      id: 'termination',
      title: "Suspension and Termination",
      content: [
        "The Company may suspend or terminate access for violation of these Terms:",
        "• For suspected fraud or safety concern",
        "• To comply with legal requirements",
        "Users may request account deletion subject to applicable laws."
      ]
    },
    {
      id: 'liability',
      title: "Limitation of Liability",
      content: [
        "To the maximum extent permitted by law:",
        "• The Company shall not be liable for indirect, incidental, or consequential damages.",
        "• Total liability shall not exceed the amount paid by the user in the previous 3 months."
      ]
    },
    {
      id: 'indemnification',
      title: "Indemnification",
      content: [
        "Users agree to indemnify and hold harmless the Company from claims, losses, or damages arising from:",
        "• Violation of these Terms",
        "• Misuse of the Services",
        "• Breach of applicable laws"
      ]
    },
    {
      id: 'privacy',
      title: "Privacy",
      content: [
        "Use of the Services is also governed by our Privacy Policy, which forms an integral part of these Terms."
      ]
    },
    {
      id: 'force-majeure',
      title: "Force Majeure",
      content: [
        "The Company shall not be liable for failure or delay due to events beyond reasonable control, including natural disasters, strikes, government actions, or network failures."
      ]
    },
    {
      id: 'governance',
      title: "Governing Law and Jurisdiction",
      content: [
        "These Terms shall be governed by the laws of India."
      ]
    },
    {
      id: 'grievance',
      title: "Grievance Redressal",
      content: [
        "In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:",
        "• Grievance Officer: [To be appointed]",
        "• Email: dropinexpress2025@gmail.com",
        "• Address: 43, Karaya Road, Kolkata-700017, West Bengal",
        "• Response Time: Within 30 days"
      ]
    },
    {
      id: 'amendments',
      title: "Amendments",
      content: [
        "The Company reserves the right to modify these Terms at any time. Continued use of the Services constitutes acceptance of the revised Terms."
      ]
    },
    {
      id: 'contact',
      title: "Contact Information",
      content: [
        "Company Name: Drop In Express OPC (Pvt.) Ltd.",
        "Email: dropinexpress2025@gmail.com",
        "Address: 43, Karaya Road, Kolkata-700017, West Bengal"
      ]
    }
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
          <div className="text-center">
            <div className="h-12 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mx-auto mb-6"></div>
            <div className="h-6 w-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Get section numbers for main content
  const getSectionNumber = (sectionId) => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    const sectionsBefore = sections.slice(0, sectionIndex);
    const numberedSectionsBefore = sectionsBefore.filter(s => s.id !== 'summary');
    return numberedSectionsBefore.length + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-gray-100">
      <Navbar currentPath={pathname} />
      
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Terms & <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Conditions</span>
            </h1>
            <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Quick Navigation */}
          <div className="mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/10 p-6 md:p-8 border border-gray-200/60">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Quick Navigation</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sections.slice(0, 8).map((section, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(section.id)}
                      className="px-5 py-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200/60 rounded-xl text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-md transition-all duration-300 text-sm font-medium"
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-32">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/10 border border-gray-200/60 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-5 h-5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md mr-2 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </span>
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {sections.map((section, idx) => (
                        <button
                          key={idx}
                          onClick={() => scrollToSection(section.id)}
                          className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group/item ${
                            activeSection === section.id
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium border border-blue-200/60'
                              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 border border-transparent hover:border-gray-200/60'
                          }`}
                        >
                          <span className="text-sm flex items-center">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              activeSection === section.id 
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white' 
                                : 'bg-gray-100 text-gray-500 group-hover/item:bg-gray-200'
                            }`}>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.id === 'summary' ? "M9 12l2 2 4-4" : "M5 13l4 4L19 7"} />
                              </svg>
                            </span>
                            <span>{section.title}</span>
                          </span>
                        </button>
                      ))}
                    </nav>
                    
                    {/* Important Notice */}
                    <div className="mt-8 relative group/notice">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl blur-sm group-hover/notice:blur-md transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-blue-50/80 to-purple-50/80 p-5 rounded-xl border border-blue-200/40">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-800">Important Notice</h4>
                        </div>
                        <div className="text-sm text-gray-600">
                          By using our services, you agree to these terms. Please read them carefully.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="relative group/main">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm group-hover/main:blur-md transition-all duration-300"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-500/10 border border-gray-200/60 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 p-8 md:p-10 border-b border-gray-200/60">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-6 shadow-md">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Legal Agreement</h2>
                        <div className="text-gray-600">Please read these terms carefully before using our services</div>
                      </div>
                    </div>
                  </div>

                  {/* Terms Content */}
                  <div className="p-6 md:p-8">
                    {sections.map((section, idx) => {
                      const sectionNumber = section.id === 'summary' ? '' : `${getSectionNumber(section.id)}. `;
                      
                      return (
                        <div 
                          key={idx} 
                          id={section.id}
                          className={`mb-10 pb-10 ${idx < sections.length - 1 ? 'border-b border-gray-200/60' : ''}`}
                          onMouseEnter={() => setActiveSection(section.id)}
                        >
                          {/* Main Section Title - Only show purple number badge */}
                          <h3 className="text-xl font-bold text-gray-900 mb-6">
                            <div className="flex items-center">
                              {section.id !== 'summary' && (
                                <div className="relative mr-4">
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                                  <div className="relative w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-md">
                                    {getSectionNumber(section.id)}
                                  </div>
                                </div>
                              )}
                              {section.id === 'summary' ? section.title : section.title}
                            </div>
                          </h3>
                          
                          {section.id === 'definitions' ? (
                            <div className="relative group/def">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl blur-sm group-hover/def:blur-md transition-all duration-300"></div>
                              <div className="relative bg-gradient-to-br from-gray-50/80 to-white/80 rounded-xl p-6 border border-gray-200/60">
                                <div className="space-y-6">
                                  {section.content.map((item, itemIdx) => (
                                    <div key={itemIdx} className="group/item">
                                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors duration-200">
                                        <span className="font-medium text-gray-800 md:w-1/3">
                                          <span className="text-blue-600">"</span>{item.term}<span className="text-blue-600">"</span>
                                        </span>
                                        <span className="text-gray-700 md:w-2/3">
                                          {item.definition}
                                        </span>
                                      </div>
                                      {itemIdx < section.content.length - 1 && (
                                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent mx-3"></div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : section.id === 'summary' ? (
                            <div className="space-y-4">
                              {section.content.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex items-start group/item">
                                  <div className="relative mt-1 mr-4 flex-shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-sm group-hover/item:blur-md transition-all duration-300"></div>
                                    <div className="relative w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm shadow-sm">
                                      {itemIdx + 1}
                                    </div>
                                  </div>
                                  <div className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">
                                    {item}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : section.id === 'cancellations' ? (
                            <div className="space-y-8">
                              {section.content.map((subsection, subsectionIdx) => (
                                <div key={subsectionIdx} className="space-y-6">
                                  {/* 6A and 6B Titles with Purple Badges - No duplicate A/B */}
                                  <div className="flex items-center">
                                    <div className="relative mr-4">
                                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                                      <div className="relative w-12 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-md">
                                        6{subsection.letter}
                                      </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">
                                      {subsection.title}
                                    </h4>
                                  </div>
                                  {subsection.policyHeader && (
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-4 rounded-lg border border-gray-200/60 mb-6">
                                      <div className="text-gray-700 whitespace-pre-line">
                                        {subsection.policyHeader}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Subsections (1, 2, 3, etc.) */}
                                  <div className="space-y-6 ml-8">
                                    {subsection.subsections.map((subsubsection, subIdx) => (
                                      <div key={subIdx} className="space-y-4">
                                        {/* Subsection title with black text, no number badge */}
                                        <h5 className="text-md font-semibold text-gray-800">
                                          {subsubsection.title}
                                        </h5>
                                        
                                        {/* Subsection items */}
                                        <div className="space-y-3">
                                          {subsubsection.items.map((item, itemIdx) => (
                                            <div key={itemIdx} className="flex items-start">
                                              {item.startsWith('•') ? (
                                                <div className="flex items-start w-full ml-4">
                                                  <span className="text-blue-600 mr-3 mt-1">•</span>
                                                  <span className="text-gray-700">{item.substring(2)}</span>
                                                </div>
                                              ) : item.startsWith('1.') || item.startsWith('2.') || item.startsWith('3.') || item.startsWith('4.') || item.startsWith('5.') || item.startsWith('6.') ? (
                                                <div className="flex items-start w-full">
                                                  <span className="font-medium text-gray-800 min-w-[3rem]">{item.split(' ')[0]}</span>
                                                  <span className="text-gray-700 ml-2">{item.substring(item.indexOf(' ') + 1)}</span>
                                                </div>
                                              ) : (
                                                <div className="text-gray-700">{item}</div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                        
                                        {subIdx < subsection.subsections.length - 1 && (
                                          <div className="h-px bg-gradient-to-r from-transparent via-gray-200/30 to-transparent my-4"></div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {subsectionIdx < section.content.length - 1 && (
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent my-6"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {section.content.map((item, itemIdx) => {
                                // Check if item is a section header (ends with :)
                                if (item.endsWith(':')) {
                                  return (
                                    <div key={itemIdx} className="pt-2">
                                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{item}</h4>
                                    </div>
                                  );
                                }
                                // Check if item is a bullet point
                                else if (item.startsWith('•')) {
                                  return (
                                    <div key={itemIdx} className="flex items-start ml-4 group/item">
                                      <span className="text-blue-600 mr-3 mt-1">•</span>
                                      <div className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">
                                        {item.substring(2)}
                                      </div>
                                    </div>
                                  );
                                }
                                // Regular paragraph
                                else {
                                  return (
                                    <div key={itemIdx} className="group/item">
                                      <div className="text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200">
                                        {item}
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Acceptance Box */}
              <div className="mt-8 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-gray-900 via-blue-900/90 to-purple-900/90 rounded-3xl shadow-xl p-8 md:p-12 text-white border border-blue-700/30">
                  <div className="flex flex-col md:flex-row items-start md:items-center mb-8 gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
                      <div className="relative w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shadow-md">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">Your Acceptance</h3>
                      <div className="text-gray-300 text-lg">
                        By using DROP services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/10 p-6 rounded-xl border border-white/10">
                    <div className="flex-1">
                      <div className="text-sm text-gray-300 mb-1">Have questions about our terms?</div>
                      <div className="font-medium text-lg">Contact us at dropinexpress2025@gmail.com</div>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-sm text-gray-300 mb-1">Effective Date</div>
                      <div className="font-medium text-lg">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
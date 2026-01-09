'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/home/navbar';
import Footer from '@/components/home/footer';

export default function Services() {
  const pathname = usePathname();

  const services = [
    {
      title: "Food Ordering & Delivery",
      description: "DROP makes food ordering effortless by connecting customers with their favorite local restaurants and independent delivery riders.",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      features: [
        "Browse restaurants and menus",
        "Place orders instantly",
        "Track your delivery in real time",
        "Enjoy fast and reliable doorstep delivery"
      ],
      color: "from-blue-600 to-purple-600",
      bgColor: "bg-white/80 backdrop-blur-sm"
    },
    {
      title: "On-Demand Delivery Transport",
      description: "Need to send packages, groceries, or other items? DROP connects you with independent riders for quick and secure transport services.",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      features: [
        "Same-day deliveries",
        "Flexible pickup and drop-off locations",
        "Affordable and transparent pricing",
        "Package tracking and insurance"
      ],
      color: "from-blue-600 to-purple-600",
      bgColor: "bg-white/80 backdrop-blur-sm"
    },
    {
      title: "Restaurant Partner Services",
      description: "We help restaurants grow their customer base and boost sales without heavy operational costs.",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      features: [
        "Increased online visibility",
        "Simple order management",
        "Reliable delivery support",
       
      ],
      color: "from-blue-600 to-purple-600",
      bgColor: "bg-white/80 backdrop-blur-sm"
    },
    {
      title: "Rider Opportunities",
      description: "DROP provides independent riders with the freedom to earn on their own schedule.",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      features: [
        "Flexible working hours",
        "Fair earning opportunities",
        "Easy-to-use platform",
        
      ],
      color: "from-blue-600 to-purple-600",
      bgColor: "bg-white/80 backdrop-blur-sm"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-gray-100">
      <Navbar currentPath={pathname} />
      
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Our <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Services</span>
            </h1>
            <div className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive delivery solutions designed for customers, businesses, and riders
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className={`relative ${service.bgColor} rounded-3xl shadow-xl shadow-blue-500/10 border border-gray-200/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden`}>
                  <div className="p-8">
                    <div className="flex items-start mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                        <div className={`relative w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mr-5 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h2>
                        <div className="text-gray-700">{service.description}</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-md mr-2 flex items-center justify-center">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        Key Features
                      </h3>
                      <ul className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start group/feature">
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mt-0.5 mr-3 flex-shrink-0 flex items-center justify-center group-hover/feature:bg-gradient-to-br group-hover/feature:from-blue-500/40 group-hover/feature:to-purple-500/40 transition-all duration-200">
                              <svg className="w-3 h-3 text-blue-600 group-hover/feature:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700 group-hover/feature:text-gray-900 transition-colors duration-200">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className={`h-1 bg-gradient-to-r ${service.color}`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          
        </div>
      </section>

      <Footer />
    </div>
  );
}
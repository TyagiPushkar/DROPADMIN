"use client"
"use client"
// Homepage.jsx - Complete All-in-One Component
import React, { useState } from 'react';
import { 
  Truck, 
  Utensils, 
  Store, 
  User,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Menu,
  X,
  LogIn,
  ChevronDown,
  ChevronUp,
  Shield,
  FileText,
  Globe,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  Eye,
  Lock,
  Cookie,
  Child,
  ExternalLink,
  BookOpen,
  Scale
} from 'lucide-react';

const Homepage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedServices, setExpandedServices] = useState([]);
  const [expandedPrivacy, setExpandedPrivacy] = useState([]);
  const [expandedTerms, setExpandedTerms] = useState([]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleSection = (index, type) => {
    if (type === 'services') {
      setExpandedServices(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else if (type === 'privacy') {
      setExpandedPrivacy(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else if (type === 'terms') {
      setExpandedTerms(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    }
  };

  const services = [
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Food Ordering & Delivery",
      description: "DROP makes food ordering effortless by connecting customers with their favorite local restaurants and independent delivery riders.",
      features: [
        "Browse restaurants and menus",
        "Place orders instantly",
        "Track your delivery in real time",
        "Enjoy fast and reliable doorstep delivery"
      ]
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "On-Demand Delivery Transport",
      description: "Need to send packages, groceries, or other items? DROP connects you with independent riders for quick and secure transport services.",
      features: [
        "Same-day deliveries",
        "Flexible pickup and drop-off locations",
        "Affordable and transparent pricing"
      ]
    },
    {
      icon: <Store className="w-6 h-6" />,
      title: "Restaurant Partner Services",
      description: "We help restaurants grow their customer base and boost sales without heavy operational costs.",
      features: [
        "Increased online visibility",
        "Simple order management",
        "Reliable delivery support"
      ]
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Rider Opportunities",
      description: "DROP provides independent riders with the freedom to earn on their own schedule.",
      features: [
        "Flexible working hours",
        "Fair earning opportunities",
        "Easy-to-use platform"
      ]
    }
  ];

  const socialMediaLinks = [
    {
      icon: <Facebook className="w-5 h-5" />,
      label: 'Facebook',
      color: 'hover:bg-blue-100 hover:text-blue-600',
      link: 'https://www.facebook.com/'
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      label: 'Instagram',
      color: 'hover:bg-pink-100 hover:text-pink-600',
      link: 'https://www.instagram.com/'
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      color: 'hover:bg-blue-100 hover:text-blue-600',
      link: 'https://www.linkedin.com/in/shivaji62/'
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      label: 'Twitter',
      color: 'hover:bg-blue-100 hover:text-blue-600',
      link: 'https://x.com/home'
    }
  ];

  // Privacy Policy sections
  const privacyPolicySections = [
    {
      title: "1. Information We Collect",
      content: `1.1 Personal Information: Full name, Mobile number, Email address, Profile photo, Government-issued ID (where required for driver/partner verification)
1.2 Location Data: Real-time GPS location for ride booking, navigation, delivery tracking, and fraud prevention, Pickup and drop-off addresses, Saved addresses
1.3 Transaction Information: Ride and order history, Payment details (processed via secure third-party payment gateways), Invoices and receipts
1.4 Device and Technical Information: IP address, Device type, operating system, app version, Log data and crash reports
1.5 Partner Information: For drivers and delivery partners: Driving license details, Vehicle information, Bank account details, Background verification data`
    },
    {
      title: "2. How We Use Your Information",
      content: `We use your information to:
• Provide ride-hailing and food delivery services
• Match customers with drivers or delivery partners
• Process payments and refunds
• Enable real-time tracking and navigation
• Improve app functionality and user experience
• Communicate service updates, offers, and support messages
• Prevent fraud and ensure safety
• Comply with legal and regulatory requirements`
    },
    {
      title: "3. Sharing of Information",
      content: `We may share your information with:
• Drivers and delivery partners to fulfill bookings
• Restaurants and merchants for order preparation and delivery
• Payment gateways and financial institutions for secure transactions
• Third-party service providers (cloud hosting, analytics, customer support)
• Government or law enforcement authorities when required by law

We do not sell your personal data to third parties.`
    },
    {
      title: "4. Data Retention",
      content: `We retain personal data only for as long as necessary to:
• Provide services
• Comply with legal obligations
• Resolve disputes
• Enforce agreements

Data may be anonymized or deleted after the retention period.`
    },
    {
      title: "5. Your Rights",
      content: `Subject to applicable Indian laws, you have the right to:
• Access your personal data
• Request correction or updating of data
• Withdraw consent (where applicable)
• Request deletion of personal data
• Register a grievance or complaint

Requests can be made by contacting us using the details below.`
    },
    {
      title: "6. Data Security",
      content: `We implement reasonable security practices, including:
• Encryption of sensitive data
• Secure servers and access controls
• Regular security audits

Despite best efforts, no system is completely secure.`
    },
    {
      title: "7. Cookies and Tracking Technologies",
      content: `We use cookies and similar technologies to:
• Maintain user sessions
• Analyze app performance
• Improve service delivery

You may control cookies through device settings.`
    },
    {
      title: "8. Children's Privacy",
      content: `Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors.`
    },
    {
      title: "9. Third-Party Links",
      content: `Our app may contain links to third-party websites or services. We are not responsible for their privacy practices.`
    },
    {
      title: "10. Changes to This Privacy Policy",
      content: `We may update this Privacy Policy from time to time. Changes will be notified through the app or website. Continued use of services constitutes acceptance of the revised policy.`
    },
    {
      title: "11. Grievance Officer / Contact Information",
      content: `In accordance with Indian law, the Grievance Officer details are:
Name: [Grievance Officer Name]
Email: [support@appname.com]
Address: 43, Karaya Road, Kolkata -700017, West Bengal, India
Response Time: Within 7 working days`
    }
  ];

  // Terms & Conditions sections
  const termsSections = [
    {
      title: "1. Definitions",
      content: `• "App" means the mobile application.
• "Company", "We", "Us", "Our" refers to DROP IN EXPRESS OPC Pvt Ltd.
• "User" refers to passengers, food customers, drivers, delivery partners, or any person using the Services.
• "Driver" refers to a bike rider registered on the platform to provide ride or delivery services.
• "Customer" refers to passengers and food delivery customers.`
    },
    {
      title: "2. Eligibility of Bike Driver",
      content: `• You must be at least 18 years old to use the Services.
• Drivers must hold a valid driving license, vehicle registration, insurance, and any permits required under Indian law.
• DROP does not have a responsibility regarding the veracity of the Driver's License, AADHAR Number & details of RC (Smart Card) of each Driver.
• By using the App, you represent that you are legally competent to enter into a binding contract under the Indian Contract Act, 1872.`
    },
    {
      title: "3. Scope of Services",
      content: `• The Company provides a technology platform to connect drivers with customers for:
  a. Bike taxi / passenger transportation
  b. Food delivery services
• The Company does not own, operate, or control vehicles and is not a transportation provider.`
    },
    {
      title: "4. Account Registration",
      content: `• Users must provide accurate and complete information during registration.
• You are responsible for maintaining the confidentiality of your account credentials.
• The Company reserves the right to suspend or terminate accounts providing false or misleading information.`
    },
    {
      title: "5. Bookings and Payments",
      content: `• Fares, delivery charges, and applicable taxes will be displayed before confirmation.
• Payments may be made via UPI, cards, wallets, or other approved payment methods.
• The Company may charge a platform/service fee.
• All payments are processed through third-party payment gateways in compliance with RBI guidelines.`
    },
    {
      title: "6. Cancellations and Refunds",
      content: `• Cancellation charges may apply depending on timing and service type.
• Refunds, if applicable, will be processed to the original payment method.
• The Company reserves the right to modify cancellation and refund policies at any time.`
    },
    {
      title: "7. Driver Obligations",
      content: `Drivers agree to:
• Comply with all applicable Motor Vehicles Act, 1988 and traffic laws
• Maintain vehicle safety and cleanliness
• Behave professionally and respectfully
• Not engage in unlawful, abusive, or unsafe conduct
• Complete rides or deliveries once accepted unless justified`
    },
    {
      title: "8. User Conduct",
      content: `Users shall not:
• Misuse the App for illegal or fraudulent activities
• Harass, abuse, or threaten drivers or customers
• Damage vehicles or delivery items
• Provide false information
• Attempt to bypass the platform's payment system`
    },
    {
      title: "9. Food Delivery",
      content: `• Food quality, preparation, and hygiene are the responsibility of the restaurant/merchant.
• The Company is not responsible for food quality but will facilitate issue resolution.
• Delivery times are estimates and may vary due to traffic or other factors.`
    },
    {
      title: "10. Ratings and Reviews",
      content: `• Users may provide ratings and feedback.
• The Company reserves the right to remove inappropriate or misleading reviews.`
    },
    {
      title: "11. Safety and Liability",
      content: `• The Company does not guarantee uninterrupted or error-free Services.
• Users acknowledge inherent risks in transportation and delivery services.
• The Company is not liable for:
  a. Acts or omissions of drivers or users
  b. Loss of personal belongings
  c. Delays due to weather, traffic, or force majeure`
    },
    {
      title: "12. Insurance",
      content: `• Drivers are responsible for maintaining valid vehicle insurance as per Indian law.`
    },
    {
      title: "13. Intellectual Property",
      content: `• All contents, trademarks, logos, and software are owned by the Company.
• Users may not copy, modify, distribute, or exploit any content without permission.`
    },
    {
      title: "14. Suspension and Termination",
      content: `• The Company may suspend or terminate access for violation of these Terms:
  a. For suspected fraud or safety concern
  b. To comply with legal requirements
• Users may request account deletion subject to applicable laws.`
    },
    {
      title: "15. Limitation of Liability",
      content: `• To the maximum extent permitted by law:
  a. The Company shall not be liable for indirect, incidental, or consequential damages.
  b. Total liability shall not exceed the amount paid by the user in the previous 3 months.`
    },
    {
      title: "16. Indemnification",
      content: `• Users agree to indemnify and hold harmless the Company from claims, losses, or damages arising from:
  a. Violation of these Terms
  b. Misuse of the Services
  c. Breach of applicable laws`
    },
    {
      title: "17. Privacy",
      content: `• Use of the Services is also governed by our Privacy Policy, which forms an integral part of these Terms.`
    },
    {
      title: "18. Force Majeure",
      content: `• The Company shall not be liable for failure or delay due to events beyond reasonable control, including natural disasters, strikes, government actions, or network failures.`
    },
    {
      title: "19. Governing Law and Jurisdiction",
      content: `• These Terms shall be governed by the laws of India.`
    },
    {
      title: "20. Grievance Redressal",
      content: `• In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:
  a. Grievance Officer: [Name]
  b. Email: [Email]
  c. Address: 43, Karaya Road, Kolkata-700017, West Bengal
  d. Response Time: Within 30 days`
    },
    {
      title: "21. Amendments",
      content: `• The Company reserves the right to modify these Terms at any time. Continued use of the Services constitutes acceptance of the revised Terms.`
    },
    {
      title: "22. Contact Information",
      content: `• Company Name: Drop In Express OPC (Pvt.) Ltd.
• Email: dropinexpress2025@gmail.com
• Address: 43, Karaya Road, Kolkata-700017, West Bengal`
    }
  ];

  const businessModelPoints = [
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  DROP
                </h1>
                <p className="text-xs text-gray-500">Fast. Reliable. Delivered.</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'services', 'contact', 'privacy', 'terms'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-gray-700 hover:text-blue-700 font-medium transition-colors duration-200 cursor-pointer"
                >
                  {item === 'privacy' ? 'Privacy Policy' : 
                   item === 'terms' ? 'Terms & Conditions' : 
                   item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
              <a 
                href="/login" 
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              {['home', 'about', 'services', 'contact', 'privacy', 'terms'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer font-medium text-gray-700"
                >
                  {item === 'privacy' ? 'Privacy Policy' : 
                   item === 'terms' ? 'Terms & Conditions' : 
                   item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
              <a 
                href="/login" 
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent pointer-events-none"></div>
        <div className="container mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Truck className="w-4 h-4" />
              <span>Fast. Reliable. Delivered with DROP.</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your All-in-One Delivery Platform
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              DROP is your all-in-one delivery platform designed to make everyday transport and food delivery simple,
              fast, and affordable. Whether you're craving your favorite meal or need items delivered across town,
              DROP connects you with trusted independent riders who get the job done-on time, every time.
            </p>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              With just a few taps, customers can place orders, track deliveries in real time, and enjoy seamless
              service. Restaurants grow their reach, riders earn on their own terms, and customers enjoy convenience
              like never before.
            </p>
            
            <p className="text-2xl font-bold text-blue-700 mb-8">
              DROP it. Track it. Receive it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5">
                Book Now
              </button>
              <a 
  href="/add-rider" 
  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 cursor-pointer inline-flex items-center justify-center"
>
  Become a Rider
</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-lg mb-10">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                DROP is a technology-driven delivery platform built to bridge the gap between customers, restaurants,
                and independent riders. Our goal is to simplify delivery services while creating opportunities for local
                businesses and riders to thrive.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe delivery should be fast, transparent, and accessible to everyone. By leveraging smart
                technology, DROP empowers customers to order with confidence, restaurants to expand their business,
                and riders to work independently with flexibility.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-blue-100 shadow-md">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-700">
                  To create a reliable, efficient, and inclusive delivery ecosystem that benefits customers, businesses,
                  and riders alike.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-blue-100 shadow-md">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-700">
                  To become a trusted everyday delivery partner, transforming how people move goods and enjoy food
                  through innovation and convenience.
                </p>
              </div>
            </div>

            {/* Business Operating Model */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Business Operating Model</h3>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  {businessModelPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-200"
                onClick={() => toggleSection(index, 'services')}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                        <div className="text-white">
                          {service.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    </div>
                    <button className="text-gray-400 hover:text-blue-600 cursor-pointer">
                      {expandedServices.includes(index) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  {expandedServices.includes(index) && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <ul className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-3 text-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">
                        DROP IN EXPRESS OPC Pvt Ltd<br />
                        43, Karaya Road, West Bengal<br />
                        Kolkata 700017, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                      <a 
                        href="mailto:dropinexpress2025@gmail.com" 
                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        dropinexpress2025@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Landline Telephone</h4>
                      <p className="text-gray-600">
                        To be provided later
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Media Section */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Social Media Handles</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  These are representative links. Actual links for DROP will be created and given later.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {socialMediaLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${social.color}`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        {social.icon}
                      </div>
                      <span className="font-medium text-gray-700">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section id="privacy" className="py-16 md:py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Introduction</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy describes how Drop, owned and operated by Drop In Express OPC (Pvt.) Ltd., having
                its registered office at 43, Karaya Road, Kolkata -700017, West Bengal, India, collects, uses, shares, and
                protects personal data of users, who access or use our mobile application and related services for
                customer transport and food delivery.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                This Privacy Policy is published in compliance with:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-medium text-blue-700">The Information Technology Act, 2000</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-medium text-blue-700">The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-medium text-blue-700">The Digital Personal Data Protection Act, 2023 (DPDP Act)</p>
                </div>
              </div>
            </div>

            {/* Privacy Policy Sections */}
            <div className="space-y-4">
              {privacyPolicySections.map((section, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleSection(index, 'privacy')}
                    className="w-full text-left p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-blue-700">{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        expandedPrivacy.includes(index) ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedPrivacy.includes(index) && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {section.content.split('\n').map((line, idx) => (
                          <p key={idx} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions Section */}
      <section id="terms" className="py-16 md:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Terms Sections */}
            <div className="space-y-4">
              {termsSections.map((section, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleSection(index, 'terms')}
                    className="w-full text-left p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-blue-700">{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        expandedTerms.includes(index) ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedTerms.includes(index) && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {section.content.split('\n').map((line, idx) => (
                          <p key={idx} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">DROP</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Fast. Reliable. Delivered with DROP.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                DROP it. Track it. Receive it.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['home', 'about', 'services', 'contact', 'privacy', 'terms'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item)}
                      className="text-gray-400 hover:text-white cursor-pointer text-sm transition-colors"
                    >
                      {item === 'privacy' ? 'Privacy Policy' : 
                       item === 'terms' ? 'Terms & Conditions' : 
                       item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  </li>
                ))}
                <li>
                  <a href="/login" className="text-gray-400 hover:text-white cursor-pointer text-sm transition-colors">
                    Login
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal Documents</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('terms')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white cursor-pointer text-sm transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Terms & Conditions</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('privacy')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white cursor-pointer text-sm transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  43, Karaya Road<br />
                  Kolkata 700017<br />
                  West Bengal, India
                </p>
                <a 
                  href="mailto:dropinexpress2025@gmail.com" 
                  className="text-blue-300 hover:text-blue-200 cursor-pointer text-sm transition-colors"
                >
                  dropinexpress2025@gmail.com
                </a>
                <p className="text-gray-400 text-sm mt-2">
                  Landline Telephone: To be provided later
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} DROP IN EXPRESS OPC Pvt Ltd. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Registered Office: 43, Karaya Road, Kolkata 700017, West Bengal, India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
export const BASE_URL = "https://namami-infotech.com/DROP/src/"

'use client';

import Link from 'next/link';

export default function Footer() {
  const socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { name: 'Instagram', url: 'https://www.instagram.com/', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shivaji62/', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { name: 'X', url: 'https://x.com/home', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white border-t border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div>
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <div className="w-6 h-6 relative">
                    <div className="absolute w-3 h-3 bg-white rounded-full top-1 left-1/2 transform -translate-x-1/2"></div>
                    <div className="absolute w-4 h-4 bg-white/90 rounded-full top-3 left-1/2 transform -translate-x-1/2"></div>
                    <div className="absolute w-6 h-6 bg-white/80 rounded-full top-5 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              <h3 className="ml-4 text-2xl font-bold bg-gradient-to-r from-gray-100 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Contact Us
              </h3>
            </div>
            <div className="space-y-4 text-gray-300">
              <div className="text-xl font-semibold text-white bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                DROP IN EXPRESS OPC Pvt Ltd
              </div>
              <div className="space-y-3">
                <div className="flex items-start group">
                  <div className="w-5 h-5 mr-3 mt-1 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 p-1 rounded-md group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="group-hover:text-blue-100 transition-colors duration-200">
                    43, Karaya Road<br />West Bengal<br />Kolkata 700017<br />India
                  </div>
                </div>
                <div className="flex items-center group">
                  <div className="w-5 h-5 mr-3 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 p-1 rounded-md group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <a 
                    href="mailto:dropinexpress2025@gmail.com" 
                    className="text-blue-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-lg px-2 py-1 transition-all duration-200"
                  >
                    dropinexpress2025@gmail.com
                  </a>
                </div>
                <div className="flex items-center group">
                  <div className="w-5 h-5 mr-3 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 p-1 rounded-md group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div className="group-hover:text-blue-100 transition-colors duration-200">
                    Landline Telephone: <span className="italic text-gray-400">To be provided later</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
              </div>
              <h3 className="ml-4 text-2xl font-bold bg-gradient-to-r from-gray-100 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Connect With Us
              </h3>
            </div>
            <div className="text-gray-300 mb-6">Follow us on social media for updates and announcements</div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group"
                  aria-label={social.name}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-md border border-gray-700/50 group-hover:border-blue-500/30 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-600/90 group-hover:to-purple-600/90 transition-all duration-300">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.icon} />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="ml-4 text-2xl font-bold bg-gradient-to-r from-gray-100 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Quick Links
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                { href: '/privacy', text: 'Privacy Policy', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                { href: '/terms', text: 'Terms & Conditions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { href: '/services', text: 'Our Services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { href: '/about', text: 'About Us', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="flex items-center text-gray-300 hover:text-white group rounded-lg px-3 py-2 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-200"
                  >
                    <div className="w-5 h-5 mr-3 flex-shrink-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-md flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-purple-500/40 transition-all duration-200">
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                      </svg>
                    </div>
                    <span>{link.text}</span>
                    <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-blue-400 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800/60 text-center">
          <div className="text-gray-400">
            &copy; {new Date().getFullYear()} DROP IN EXPRESS OPC Pvt Ltd. All rights reserved.
          </div>
          <div className="mt-2 text-sm  bg-gradient-to-r from-gray-500 via-blue-400/60 to-purple-400/60 bg-clip-text text-transparent">
            Fast. Reliable. Delivered with DROP.
          </div>
        </div>
      </div>
    </footer>
  );
}
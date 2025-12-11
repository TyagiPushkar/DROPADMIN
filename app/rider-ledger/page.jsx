"use client";
import { 
  Phone, 
  Hash, 
  CalendarDays, 
  Wallet, 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Download,
  Filter,
  MoreVertical,
  Search,
  ChevronDown,
  Users,
  BarChart3
} from "lucide-react";
import { useState } from "react";

export default function DriverLedger() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Sample data for demonstration
  const sampleData = [
    {
      id: 1,
      mobile: "+91 98765 43210",
      aadhar: "1234 5678 9012",
      date: "15 Mar 2024",
      openingBalance: 1500,
      purchase: 500,
      used: 200,
      closingBalance: 1800,
      reorderPoint: 500,
      couponsPurchased: 5,
      status: "active"
    },
    {
      id: 2,
      mobile: "+91 87654 32109",
      aadhar: "2345 6789 0123",
      date: "16 Mar 2024",
      openingBalance: 2000,
      purchase: 1000,
      used: 800,
      closingBalance: 2200,
      reorderPoint: 1000,
      couponsPurchased: 10,
      status: "topped-up"
    },
    {
      id: 3,
      mobile: "+91 76543 21098",
      aadhar: "3456 7890 1234",
      date: "17 Mar 2024",
      openingBalance: 1200,
      purchase: 0,
      used: 300,
      closingBalance: 900,
      reorderPoint: 500,
      couponsPurchased: 0,
      status: "low-balance"
    },
    {
      id: 4,
      mobile: "+91 65432 10987",
      aadhar: "4567 8901 2345",
      date: "18 Mar 2024",
      openingBalance: 3000,
      purchase: 1500,
      used: 1200,
      closingBalance: 3300,
      reorderPoint: 1500,
      couponsPurchased: 15,
      status: "active"
    },
    {
      id: 5,
      mobile: "+91 54321 09876",
      aadhar: "5678 9012 3456",
      date: "19 Mar 2024",
      openingBalance: 1800,
      purchase: 200,
      used: 500,
      closingBalance: 1500,
      reorderPoint: 1000,
      couponsPurchased: 2,
      status: "topped-up"
    }
  ];

  // Enhanced StatusBadge component
  const StatusBadge = ({ purchase, used }) => {
    if (purchase > 0 && used > 0) return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
        Active
      </span>
    );
    if (purchase > 0) return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        Topped Up
      </span>
    );
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
        Low Balance
      </span>
    );
  };

  // Filter data based on search and filters
  const filteredData = sampleData.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.aadhar.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && item.purchase > 0 && item.used > 0) ||
      (statusFilter === "topped-up" && item.purchase > 0 && item.used === 0) ||
      (statusFilter === "low-balance" && item.purchase === 0 && item.used > 0);
    
    return matchesSearch && matchesStatus;
  });

  // Summary statistics
  const summary = {
    totalUsers: filteredData.length,
    totalBalance: filteredData.reduce((sum, item) => sum + item.closingBalance, 0),
    totalPurchases: filteredData.reduce((sum, item) => sum + item.purchase, 0),
    totalCoupons: filteredData.reduce((sum, item) => sum + item.couponsPurchased, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="mx-2">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Coupon & Wallet Management</h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">Track wallet balances and coupon transactions across all users</p>
            </div>
            
            
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalUsers}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{summary.totalBalance.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Purchases</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{summary.totalPurchases.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Coupons Purchased</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalCoupons}</p>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by mobile number or Aadhar..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="topped-up">Topped Up</option>
                    <option value="low-balance">Low Balance</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                
                <button className="px-4 py-2.5 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{sampleData.length}</span> users
              </div>
              <div className="text-sm text-gray-600">
                Updated just now
              </div>
            </div>
          </div>
        </div>

        {/* Desktop/Tablet View */}
        <div className="hidden md:block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Enhanced Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {/* Main Header Row */}
                  <tr className="bg-gradient-to-r from-gray-900 to-gray-800">
                    {/* User Info */}
                    <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span>Mobile No.</span>
                      </div>
                    </th>
                    <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Hash className="w-4 h-4" />
                        </div>
                        <span>Aadhar No.</span>
                      </div>
                    </th>
                    
                    {/* Date */}
                    <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <CalendarDays className="w-4 h-4" />
                        </div>
                        <span>Date & Status</span>
                      </div>
                    </th>
                    
                    {/* COUPON STATUS - Main Header */}
                    <th colSpan="4" className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider bg-gradient-to-r from-blue-900/50 to-blue-800/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <span>COUPON WALLET STATUS</span>
                      </div>
                    </th>
                    
                    {/* Additional Info */}
                    <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <span>Reorder Point</span>
                      </div>
                    </th>
                    <th className="text-left p-6 font-semibold text-gray-100 text-sm uppercase tracking-wider">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                        <span>Coupons</span>
                      </div>
                    </th>
                  </tr>
                  
                  {/* Sub-headers for Coupon Status */}
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th></th>
                    <th></th>
                    <th></th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      Opening Balance
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        Purchase
                      </span>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      <span className="flex items-center gap-2">
                        <TrendingDown className="w-3 h-3 text-red-600" />
                        Used
                      </span>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      Closing Balance
                    </th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item) => (
                    <tr 
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors duration-150 group"
                    >
                      {/* Mobile */}
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-150">
                            <Phone className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="font-semibold text-gray-900">{item.mobile}</span>
                        </div>
                      </td>
                      
                      {/* Aadhar */}
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-150">
                            <Hash className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="font-mono text-gray-700">{item.aadhar}</span>
                        </div>
                      </td>
                      
                      {/* Date */}
                      <td className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-150">
                            <CalendarDays className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="font-semibold text-gray-900">{item.date}</span>
                        </div>
                        <StatusBadge purchase={item.purchase} used={item.used} />
                      </td>
                      
                      {/* Opening Balance */}
                      <td className="p-6">
                        <div className="flex items-center gap-3 font-semibold text-gray-900">
                          <IndianRupee className="w-5 h-5 text-gray-500" />
                          <span className="text-lg">{item.openingBalance.toLocaleString()}</span>
                        </div>
                      </td>
                      
                      {/* Purchase */}
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 font-semibold text-green-700">
                            <IndianRupee className="w-5 h-5" />
                            <span className="text-lg">{item.purchase.toLocaleString()}</span>
                          </div>
                          {item.purchase > 0 && (
                            <div className="p-1.5 bg-green-50 rounded-lg">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Used */}
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 font-semibold text-red-700">
                            <IndianRupee className="w-5 h-5" />
                            <span className="text-lg">{item.used.toLocaleString()}</span>
                          </div>
                          {item.used > 0 && (
                            <div className="p-1.5 bg-red-50 rounded-lg">
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Closing Balance */}
                      <td className="p-6">
                        <div className="flex items-center gap-3 font-bold text-blue-700">
                          <IndianRupee className="w-5 h-5" />
                          <span className="text-lg">{item.closingBalance.toLocaleString()}</span>
                        </div>
                      </td>
                      
                      {/* Reorder Point */}
                      <td className="p-6">
                        <div className="flex items-center gap-3 font-semibold text-orange-700">
                          <IndianRupee className="w-5 h-5" />
                          <span className="text-lg">{item.reorderPoint.toLocaleString()}</span>
                        </div>
                      </td>
                      
                      {/* Coupons Purchased */}
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-xl font-bold text-purple-700">
                              {item.couponsPurchased}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">coupons</span>
                          </div>
                          {item.couponsPurchased > 0 && (
                            <div className="p-1.5 bg-purple-50 rounded-lg">
                              <ShoppingCart className="w-4 h-4 text-purple-600" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile View (same as before but enhanced) */}
        <div className="md:hidden space-y-4">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-lg p-5">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gray-50 rounded-lg">
                      <Phone className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <span className="font-semibold text-sm">{item.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-50 rounded-lg">
                      <Hash className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <span className="font-mono text-xs">{item.aadhar}</span>
                  </div>
                </div>
                <StatusBadge purchase={item.purchase} used={item.used} />
              </div>
              
              {/* Date */}
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <CalendarDays className="w-4 h-4" />
                <span>{item.date}</span>
              </div>
              
              {/* Coupon Status Grid */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  Coupon Wallet Status
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1 font-medium">Opening Balance</div>
                    <div className="flex items-center gap-1 font-bold">
                      <IndianRupee className="w-4 h-4" />
                      <span>{item.openingBalance.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="text-xs text-green-700 mb-1 font-medium">Purchase</div>
                    <div className="flex items-center gap-1 font-bold text-green-800">
                      <IndianRupee className="w-4 h-4" />
                      <span>{item.purchase.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                    <div className="text-xs text-red-700 mb-1 font-medium">Used</div>
                    <div className="flex items-center gap-1 font-bold text-red-800">
                      <IndianRupee className="w-4 h-4" />
                      <span>{item.used.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="text-xs text-blue-700 mb-1 font-medium">Closing Balance</div>
                    <div className="flex items-center gap-1 font-bold text-blue-800">
                      <IndianRupee className="w-4 h-4" />
                      <span>{item.closingBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1 font-medium">Reorder Point</div>
                  <div className="flex items-center gap-1 font-semibold text-orange-700">
                    <IndianRupee className="w-4 h-4" />
                    <span>{item.reorderPoint.toLocaleString()}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1 font-medium">Coupons Purchased</div>
                  <div className="text-lg font-bold text-purple-700">
                    {item.couponsPurchased} <span className="text-sm font-normal text-gray-500">coupons</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your search or filter to find what you're looking for."
                : "When users top up their wallet, transactions will appear here."}
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
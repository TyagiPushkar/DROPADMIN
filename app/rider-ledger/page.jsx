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
  MoreVertical
} from "lucide-react";

export default function DriverLedger() {
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
      couponsPurchased: 5
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
      couponsPurchased: 10
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
      couponsPurchased: 0
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
      couponsPurchased: 15
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
      couponsPurchased: 2
    }
  ];

  const StatusBadge = ({ purchase, used }) => {
    if (purchase > 0 && used > 0) return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    );
    if (purchase > 0) return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <TrendingUp className="w-3 h-3 mr-1" />
        Topped Up
      </span>
    );
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Low Balance
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-4">
      <div className="mx-2">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Coupon & Wallet Management</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Track wallet balances and coupon transactions</p>
            </div>
           
          </div>
        </div>

        {/* Desktop/Tablet View */}
        <div className="hidden md:block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    {/* User Info */}
                    <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Mobile No.
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Aadhar No.
                      </div>
                    </th>
                    
                    {/* Date */}
                    <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    
                    {/* COUPON STATUS - Main Header */}
                    <th colSpan="4" className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider bg-blue-50">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        COUPON STATUS
                      </div>
                    </th>
                    
                    {/* Additional Info */}
                    <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      Reorder Point
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                      No. of Coupon Purchased
                    </th>
                  </tr>
                  
                  {/* Sub-headers for Coupon Status */}
                  <tr className="bg-gray-50 border-b">
                    <th></th>
                    <th></th>
                    <th></th>
                    <th className="text-left p-3 font-medium text-gray-600 text-xs">
                      Opening Balance
                    </th>
                    <th className="text-left p-3 font-medium text-gray-600 text-xs">
                      Purchase
                    </th>
                    <th className="text-left p-3 font-medium text-gray-600 text-xs">
                      Used
                    </th>
                    <th className="text-left p-3 font-medium text-gray-600 text-xs">
                      Closing Balance
                    </th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                  {sampleData.map((item) => (
                    <tr 
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      {/* Mobile */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{item.mobile}</span>
                        </div>
                      </td>
                      
                      {/* Aadhar */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="font-mono">{item.aadhar}</span>
                        </div>
                      </td>
                      
                      {/* Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{item.date}</span>
                        </div>
                        <div className="mt-1">
                          <StatusBadge purchase={item.purchase} used={item.used} />
                        </div>
                      </td>
                      
                      {/* Opening Balance */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-semibold text-gray-900">
                          <IndianRupee className="w-4 h-4" />
                          <span>{item.openingBalance.toLocaleString()}</span>
                        </div>
                      </td>
                      
                      {/* Purchase */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 font-semibold text-green-700">
                            <IndianRupee className="w-4 h-4" />
                            <span>{item.purchase.toLocaleString()}</span>
                          </div>
                          {item.purchase > 0 && (
                            <ShoppingCart className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </td>
                      
                      {/* Used */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 font-semibold text-red-700">
                            <IndianRupee className="w-4 h-4" />
                            <span>{item.used.toLocaleString()}</span>
                          </div>
                          {item.used > 0 && (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      
                      {/* Closing Balance */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-bold text-blue-700">
                          <IndianRupee className="w-4 h-4" />
                          <span>{item.closingBalance.toLocaleString()}</span>
                        </div>
                      </td>
                      
                      {/* Reorder Point */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-medium text-orange-700">
                          <IndianRupee className="w-4 h-4" />
                          <span>{item.reorderPoint.toLocaleString()}</span>
                        </div>
                      </td>
                      
                      {/* Coupons Purchased */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-purple-700">
                            {item.couponsPurchased}
                          </span>
                          <span className="text-xs text-gray-500">coupons</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {sampleData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-sm">{item.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-sm">{item.aadhar}</span>
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
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  Coupon Status
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Opening Balance</div>
                    <div className="flex items-center gap-1 font-semibold">
                      <IndianRupee className="w-4 h-4" />
                      <span>{item.openingBalance.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Purchase</div>
                    <div className="flex items-center gap-1 font-semibold text-green-700">
                      <IndianRupee className="w-4 h-4" />
                      <span>{item.purchase.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Used</div>
                    <div className="flex items-center gap-1 font-semibold text-red-700">
                      <IndianRupee className="w-4 h-4" />
                      <span>{item.used.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Closing Balance</div>
                    <div className="flex items-center gap-1 font-bold text-blue-700">
                      <IndianRupee className="w-4 h-4" />
                      <span>{item.closingBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Reorder Point</div>
                  <div className="flex items-center gap-1 font-medium text-orange-700">
                    <IndianRupee className="w-4 h-4" />
                    <span>{item.reorderPoint.toLocaleString()}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">Coupons Purchased</div>
                  <div className="text-lg font-bold text-purple-700">
                    {item.couponsPurchased} <span className="text-sm font-normal text-gray-500">coupons</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sampleData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No wallet transactions found</h3>
            <p className="text-gray-500">When users top up their wallet, transactions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
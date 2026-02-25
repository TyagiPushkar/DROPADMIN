"use client";
import { 
  Phone, 
  Hash, 
  CalendarDays, 
  Wallet, 
  User, 
  Loader2, 
  RefreshCw, 
  Search, 
  Filter, 
  ChevronDown, 
  Receipt, 
  TrendingUp, 
  AlertCircle,
  IndianRupee,
  PieChart,
  Percent
} from "lucide-react";
import { useState, useEffect } from "react";
import { BASE_URL } from "../page";

export default function DriverLedger() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [data, setData] = useState([]);
  const [riderData, setRiderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch riders data
  const fetchRiders = async () => {
    try {
      const response = await fetch(BASE_URL + 'rider/get_all_rider.php');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        setRiderData(result.data);
        return result.data;
      }
      throw new Error(result.message || 'Failed to fetch riders');
    } catch (err) {
      console.error('Error fetching riders:', err);
      return [];
    }
  };

  // Calculate split amounts (59% Drop Fee, 41% GST Advance)
  const calculateSplit = (totalBalance) => {
    const dropFee = totalBalance * 0.59; // 59% for Drop Fee
    const gstAdvance = totalBalance * 0.41; // 41% for GST Advance
    return {
      total: totalBalance,
      dropFee: dropFee,
      gstAdvance: gstAdvance
    };
  };

  // Fetch all wallets first, then enrich with rider info
  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Fetch riders first
      const riders = await fetchRiders();
      
      // Fetch all wallets
      const walletResponse = await fetch(BASE_URL + 'wallets/get_all_wallets.php');
      if (!walletResponse.ok) throw new Error(`HTTP error! status: ${walletResponse.status}`);
      const walletResult = await walletResponse.json();
      if (!walletResult.success) throw new Error(walletResult.message || 'Failed to fetch wallet data');

      const wallets = walletResult.data;

      // Create a map for quick rider lookup
      const riderMap = {};
      riders.forEach(rider => {
        riderMap[Number(rider.RiderId)] = {
          name: rider.Name,
          phone: rider.PhoneNumber
        };
      });

      // Transform wallet data with rider info and split calculations
      const transformedData = wallets.map((wallet, index) => {
        const riderId = Number(wallet.RiderId);
        const riderInfo = riderMap[riderId] || {
          name: `Driver ${riderId}`,
          phone: null
        };

        const totalBalance = parseFloat(wallet.Balance) || 0;
        const splitAmounts = calculateSplit(totalBalance);

        const lastTransaction = wallet.last_transaction;
        const transactionAmount = lastTransaction ? parseFloat(lastTransaction.Amount) || 0 : 0;
        const transactionType = lastTransaction ? lastTransaction.TransactionType : null;
        const transactionDate = lastTransaction ? lastTransaction.CreatedAt : wallet.UpdatedAt;

        return {
          id: wallet.WalletId || index,
          RiderId: riderId,
          riderName: riderInfo.name,
          riderPhone: riderInfo.phone,
          totalBalance: totalBalance,
          dropFeeBalance: splitAmounts.dropFee,
          gstAdvanceBalance: splitAmounts.gstAdvance,
          lastTransactionAmount: transactionAmount,
          lastTransactionType: transactionType,
          updatedAt: wallet.UpdatedAt,
          transactionDate,
          rawData: wallet
        };
      });

      setData(transformedData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const timeAgo = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const filteredData = data.filter(item => {
    const matchesSearch = searchQuery === "" ||
      item.RiderId.toString().includes(searchQuery) ||
      item.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.riderPhone && item.riderPhone.includes(searchQuery));
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-2">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Driver Wallets</h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">Manage and monitor driver wallet balances (Drop Fee | GST Advance)</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Driver ID, Name, or Phone..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Table */}
        <div className="hidden md:block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Driver</th>
                    <th className="text-left p-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Last Activity</th>
                    <th className="text-left p-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Drop Fee</th>
                    <th className="text-left p-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">GST Advance</th>
                    <th className="text-left p-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Total Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-lg text-gray-900">{item.riderName}'s Wallet</div>
                            <div className="text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-2">
                                <Hash className="w-3 h-3" />
                                <span>Driver ID: {item.RiderId}</span>
                              </div>
                              {item.riderPhone && (
                                <div className="flex items-center gap-2 mt-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{item.riderPhone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-sm text-gray-600">Updated {timeAgo(item.updatedAt)}</span>
                            <div className="text-xs text-gray-500 mt-1">{formatDate(item.updatedAt)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${item.dropFeeBalance >= 100 ? 'bg-green-50' : item.dropFeeBalance > 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                            
                          </div>
                          <div>
                            <div className={`font-bold text-lg ${item.dropFeeBalance >= 100 ? 'text-green-700' : item.dropFeeBalance > 0 ? 'text-yellow-700' : 'text-gray-700'}`}>
                              ₹{item.dropFeeBalance.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${item.gstAdvanceBalance >= 50 ? 'bg-purple-50' : item.gstAdvanceBalance > 0 ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                            
                          </div>
                          <div>
                            <div className={`font-bold text-lg ${item.gstAdvanceBalance >= 50 ? 'text-purple-700' : item.gstAdvanceBalance > 0 ? 'text-indigo-700' : 'text-gray-700'}`}>
                              ₹{item.gstAdvanceBalance.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                           
                          </div>
                          <div>
                            <div className="font-bold text-lg text-blue-700">₹{item.totalBalance.toFixed(2)}</div>
                          </div>
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
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-lg p-5">
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{item.riderName}'s Wallet</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3" />
                      <span>Driver ID: {item.RiderId}</span>
                    </div>
                    {item.riderPhone && (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3" />
                        <span>{item.riderPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Balance Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    
                    <span className="text-sm font-medium text-gray-700">Drop Fee</span>
                  </div>
                  <span className="font-bold text-green-700">₹{item.dropFeeBalance.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    
                    <span className="text-sm font-medium text-gray-700">GST Advance</span>
                  </div>
                  <span className="font-bold text-purple-700">₹{item.gstAdvanceBalance.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    
                    <span className="text-sm font-medium text-gray-700">Total Balance</span>
                  </div>
                  <span className="font-bold text-blue-700">₹{item.totalBalance.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100">
                <CalendarDays className="w-4 h-4" />
                <span>Updated: {timeAgo(item.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
}
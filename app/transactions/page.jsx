// app/transactions/page.jsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, X, User, Calendar, RefreshCw, CreditCard, CheckCircle, XCircle, Clock, ChevronDown, Download } from 'lucide-react';
import { BASE_URL } from '../page';

export default function TransactionsDashboard() {
  // State
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'TransactionId', direction: 'desc' });

  // Filters - Changed userId to riderId
  const [filters, setFilters] = useState({
    riderId: '', // Changed from userId
    startDate: '',
    endDate: '',
    transactionType: 'ALL',
    status: 'ALL',
    paymentMode: 'ALL',
    searchQuery: ''
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      // 1️⃣ Fetch transactions
      const txnRes = await fetch(BASE_URL + 'wallets/get_transactions.php');
      const txnData = await txnRes.json();
  
      if (!txnData.success) {
        setError('Failed to fetch transactions');
        return;
      }
  
      // 2️⃣ Fetch riders
      const riderRes = await fetch(BASE_URL + 'rider/get_all_rider.php');
      const riderData = await riderRes.json();
  
      if (!riderData.success) {
        setError('Failed to fetch riders');
        return;
      }
  
      // 3️⃣ Build RiderId → Name map
      const ridersMap = {};
      riderData.data.forEach((rider) => {
        ridersMap[rider.RiderId] = rider.FullName || rider.Name || '-';
      });
  
      // 4️⃣ Attach rider name to each transaction
      const enrichedTransactions = txnData.data.map((txn) => ({
        ...txn,
        Name: ridersMap[txn.RiderId] || '-',
        // Ensure RiderId exists (in case your API uses UserId but we want to display as RiderId)
        DisplayRiderId: txn.RiderId || txn.UserId || '-'
      }));
  
      setTransactions(enrichedTransactions);
      setFilteredTransactions(enrichedTransactions);
  
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters - Updated for RiderId
  const applyFilters = useCallback(() => {
    let filtered = [...transactions];

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.RiderId.toString().toLowerCase().includes(query) ||
        (t.Name && t.Name.toLowerCase().includes(query)) ||
        t.Description.toLowerCase().includes(query) ||
        t.TransactionType.toLowerCase().includes(query) ||
        t.Status.toLowerCase().includes(query)
      );
    }

    // Rider ID filter - Changed from UserId
    if (filters.riderId) {
      filtered = filtered.filter(t => 
        t.RiderId.toString().includes(filters.riderId)
      );
    }

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter(t => 
        new Date(t.CreatedAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(t => 
        new Date(t.CreatedAt) <= endDate
      );
    }

    // Dropdown filters
    if (filters.transactionType !== 'ALL') {
      filtered = filtered.filter(t => 
        t.TransactionType === filters.transactionType
      );
    }

    if (filters.status !== 'ALL') {
      filtered = filtered.filter(t => 
        t.Status === filters.status
      );
    }

    if (filters.paymentMode !== 'ALL') {
      filtered = filtered.filter(t => 
        t.PaymentMode === filters.paymentMode
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(filtered);
  }, [transactions, filters, sortConfig]);

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Reset filters - Updated
  const resetFilters = () => {
    setFilters({
      riderId: '', // Changed from userId
      startDate: '',
      endDate: '',
      transactionType: 'ALL',
      status: 'ALL',
      paymentMode: 'ALL',
      searchQuery: ''
    });
  };

  // Open modal
  const openTransactionModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Close modal
  const closeTransactionModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTransaction(null), 300);
  };

  // Export to CSV - Updated headers
  const exportToCSV = () => {
    const headers = ['Rider ID', 'Rider Name', 'Transaction ID', 'Amount', 'Type', 'Mode', 'Status', 'Description', 'Date'];
    const csvData = filteredTransactions.map(t => [
      t.RiderId,
      t.Name,
      t.TransactionId,
      t.Amount,
      t.TransactionType,
      t.PaymentMode,
      t.Status,
      t.Description,
      t.CreatedAt
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Get unique values for dropdowns
  const { transactionTypes, statuses, paymentModes } = useMemo(() => {
    const types = ['ALL', ...new Set(transactions.map(t => t.TransactionType))];
    const statuses = ['ALL', ...new Set(transactions.map(t => t.Status))];
    const modes = ['ALL', ...new Set(transactions.map(t => t.PaymentMode))];
    return { transactionTypes: types, statuses, paymentModes: modes };
  }, [transactions]);

  // Calculate stats - Updated for RiderId
  const stats = useMemo(() => {
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.Amount), 0);
    const successCount = filteredTransactions.filter(t => t.Status === 'SUCCESS').length;
    const pendingCount = filteredTransactions.filter(t => t.Status === 'PENDING').length;
    const failedCount = filteredTransactions.filter(t => t.Status === 'FAILED').length;
    const uniqueRiders = new Set(filteredTransactions.map(t => t.RiderId)).size; // Changed from UserId
    
    const typeBreakdown = filteredTransactions.reduce((acc, t) => {
      const type = t.TransactionType.replace(/_/g, ' ');
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalAmount,
      successCount,
      pendingCount,
      failedCount,
      uniqueRiders, // Changed from uniqueUsers
      typeBreakdown
    };
  }, [filteredTransactions]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'FAILED': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get amount color
  const getAmountColor = (type) => {
    if (type.includes('DEBIT') || type.includes('WITHDRAWAL')) return 'text-rose-600';
    if (type.includes('REFUND') || type.includes('RECHARGE')) return 'text-emerald-600';
    return 'text-blue-600';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return null;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage all rider transactions</p> {/* Updated text */}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportToCSV}
                disabled={filteredTransactions.length === 0}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={fetchTransactions}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-2 px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filters Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by Rider ID, Rider Name, Description..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Rider ID Filter - Updated */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rider ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter Rider ID"
                      value={filters.riderId} // Changed from userId
                      onChange={(e) => setFilters({...filters, riderId: e.target.value})} // Changed from userId
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Type
                  </label>
                  <select
                    value={filters.transactionType}
                    onChange={(e) => setFilters({...filters, transactionType: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    {transactionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === 'ALL' ? 'All Types' : type.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === 'ALL' ? 'All Statuses' : status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode
                  </label>
                  <select
                    value={filters.paymentMode}
                    onChange={(e) => setFilters({...filters, paymentMode: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    {paymentModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode === 'ALL' ? 'All Modes' : mode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary - Updated stats display */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {/* <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{filteredTransactions.length}</span> transactions • 
                  <span className="font-semibold ml-2">{stats.uniqueRiders}</span> unique riders
                </p>
              </div> */}
              {Object.keys(stats.typeBreakdown).length > 0 && (
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  {Object.entries(stats.typeBreakdown).slice(0, 3).map(([type, count]) => (
                    <span key={type} className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 cursor-default">
                      {type}: {count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions Table - Updated headers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 cursor-default">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 cursor-default">
              <div className="text-rose-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchTransactions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 cursor-default">
              <div className="text-gray-400 text-6xl mb-4">💸</div>
              <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
              <p className="text-gray-600 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'TransactionId', label: 'Transaction ID' },
                      { key: 'RiderId', label: 'Rider ID' },
                      { key: 'Name', label: 'Rider Name' },
                      { key: 'Amount', label: 'Amount' },
                      { key: 'TransactionType', label: 'Type' },
                      { key: 'PaymentMode', label: 'Mode' },
                      { key: 'Status', label: 'Status' },
                      { key: 'Description', label: 'Description' },
                      { key: 'CreatedAt', label: 'Date' }
                    ].map((column) => (
                      <th
                        key={column.key}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100`}
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="flex items-center">
                          {column.label}
                          {sortConfig.key === column.key && (
                            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${
                              sortConfig.direction === 'desc' ? 'rotate-180' : ''
                            }`} />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.TransactionId}
                      onClick={() => openTransactionModal(transaction)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{transaction.TransactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {transaction.RiderId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {transaction.Name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${getAmountColor(transaction.TransactionType)}`}>
                          ₹{parseFloat(transaction.Amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {transaction.TransactionType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.PaymentMode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.Status)}`}>
                          {getStatusIcon(transaction.Status)}
                          <span className="ml-1.5">{transaction.Status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {transaction.Description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(transaction.CreatedAt)}</div>
                        <div className="text-xs text-gray-500">{formatTime(transaction.CreatedAt)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Transaction Details Modal - Updated for RiderId */}
      {selectedTransaction && (
        <div className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${
          isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop with blur */}
          <div 
            className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity cursor-pointer ${
              isModalOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeTransactionModal}
          />

          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className={`relative w-full max-w-2xl transform transition-all duration-300 ${
              isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        getAmountColor(selectedTransaction.TransactionType)
                          .replace('text-', 'bg-')
                          .replace('-600', '-100')
                      }`}>
                        <CreditCard className={`w-6 h-6 ${getAmountColor(selectedTransaction.TransactionType)}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Transaction #{selectedTransaction.TransactionId}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(selectedTransaction.Status)}
                          <span className="text-sm font-medium text-gray-600">
                            {selectedTransaction.Status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={closeTransactionModal}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-5">
                  {/* Amount Display */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 cursor-default">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Transaction Amount</p>
                        <p className={`text-3xl font-bold mt-1 ${getAmountColor(selectedTransaction.TransactionType)}`}>
                          ₹{parseFloat(selectedTransaction.Amount).toFixed(2)}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg ${
                        getStatusColor(selectedTransaction.Status).split(' ')[0].replace('bg-', 'bg-').replace('100', '50')
                      }`}>
                        <span className={`font-medium ${
                          getStatusColor(selectedTransaction.Status).split(' ')[1]
                        }`}>
                          {selectedTransaction.TransactionType.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid - Updated for Rider */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-default">
                    {[
                      { label: 'Rider ID', value: selectedTransaction.RiderId },
                      { label: 'Rider Name', value: selectedTransaction.Name || '-' },
                      { label: 'Transaction Type', value: selectedTransaction.TransactionType.replace(/_/g, ' ') },
                      { label: 'Payment Mode', value: selectedTransaction.PaymentMode },
                      { label: 'Payment Gateway', value: selectedTransaction.PaymentGateway || 'N/A' },
                      { label: 'Gateway Order ID', value: selectedTransaction.GatewayOrderId || 'N/A' },
                      { label: 'Gateway Payment ID', value: selectedTransaction.GatewayPaymentId || 'N/A' },
                      { label: 'Date', value: formatDate(selectedTransaction.CreatedAt) },
                      { label: 'Time', value: formatTime(selectedTransaction.CreatedAt) },
                    ].map((item, index) => (
                      <div key={index} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="mt-6 cursor-default">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Description
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-900">{selectedTransaction.Description}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeTransactionModal}
                      className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const text = `Transaction ID: ${selectedTransaction.TransactionId}
Rider ID: ${selectedTransaction.RiderId}
Rider Name: ${selectedTransaction.Name || '-'}
Amount: ₹${selectedTransaction.Amount}
Type: ${selectedTransaction.TransactionType}
Status: ${selectedTransaction.Status}
Date: ${selectedTransaction.CreatedAt}
Description: ${selectedTransaction.Description}`;
                        navigator.clipboard.writeText(text);
                      }}
                      className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Copy Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
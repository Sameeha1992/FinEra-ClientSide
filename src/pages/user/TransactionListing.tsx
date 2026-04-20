import React, { useState, useEffect } from "react";
import { useUserTransactions } from "@/hooks/transactions/useTransactions";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import ClearSearchButton from "@/components/ui/ClearSearchButton";

const UserTransactionListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const limit = 10;

  const { data, isLoading, isError, error } = useUserTransactions(page, limit, debouncedSearch);

  // Reset pagination when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={12} />
            Success
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
            <XCircle size={12} />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock size={12} />
            {status}
          </span>
        );
    }
  };

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="text-teal-600" />
          Transaction History
        </h2>
        <p className="text-sm text-slate-500 mt-1">View all your EMI repayments and penalty payments</p>
      </div>

      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
        />
        <ClearSearchButton 
          show={search.length > 0} 
          onClick={handleClearSearch} 
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        {renderHeader()}
        <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Fetching your transactions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        {renderHeader()}
        <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4 text-center">
          <div className="bg-rose-50 p-4 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Failed to Load Transactions</h3>
          <p className="text-slate-500 max-w-xs">{error instanceof Error ? error.message : "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  const transactions = data?.transactions || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.currentPage || 1;

  if (transactions.length === 0 && !search) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        {renderHeader()}
        <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4 text-center">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <CreditCard className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Transactions Yet</h3>
          <p className="text-slate-500 max-w-xs">Your repayment and penalty history will appear here once you start making payments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
      {renderHeader()}

      {transactions.length === 0 && search ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-12 h-12 text-slate-200 mb-3" />
          <p className="text-slate-500 font-medium">No results found for "{search}"</p>
          <button 
            onClick={handleClearSearch}
            className="mt-4 text-sm font-bold text-teal-600 hover:text-teal-700 underline underline-offset-4"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Penalty</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {transactions.map((tx) => (
                  <tr key={tx.transactionId} className="bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm">
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs text-slate-500 font-medium">#{tx.transactionId}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-slate-600">₹{tx.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-sm font-medium ${tx.penaltyAmount > 0 ? "text-rose-500" : "text-slate-400"}`}>
                        +₹{tx.penaltyAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-900 font-poppins">₹{tx.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(tx.paymentStatus)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(tx.paidAt).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {transactions.map((tx) => (
              <div key={tx.transactionId} className="p-4 rounded-xl border border-slate-100 shadow-sm bg-white space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-slate-400 font-medium uppercase tracking-tight">#{tx.transactionId}</span>
                  {getStatusBadge(tx.paymentStatus)}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Total Amount</p>
                    <p className="text-lg font-bold text-slate-900 font-poppins">₹{tx.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 mb-0.5 flex items-center justify-end gap-1">
                      <Calendar size={10} />
                      {new Date(tx.paidAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      ₹{tx.amount} <span className="text-rose-400">+{tx.penaltyAmount}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination Controls */}
      <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
        <p className="text-sm text-slate-500 font-medium">
          Page <span className="text-slate-800">{currentPage}</span> of <span className="text-slate-800">{totalPages}</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={16} />
            Prev
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTransactionListing;

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";
import { useVendorTransactions } from "@/hooks/transactions/useTransactions";
import { TransactionsService } from "@/api/transaction/transactions";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  VendorReportFilters,
  VendorTransactionDto,
} from "@/interfaces/transaction/transaction.interface";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  User,
} from "lucide-react";
import ClearSearchButton from "@/components/ui/ClearSearchButton";

const VendorTransactionListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isDownloading, setIsDownloading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Filter States
  const [filterType, setFilterType] = useState<
    "all" | "week" | "month" | "dateRange"
  >("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString(),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYearInt = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) =>
    (currentYearInt - i).toString(),
  );

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const { data, isLoading, isError, error } = useVendorTransactions(
    page,
    limit,
    debouncedSearch,
  );

  // Reset pagination when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const getFilterParams = (): VendorReportFilters => {
    const params: VendorReportFilters = {
      transactionId: debouncedSearch || undefined,
    };

    if (filterType === "week") {
      const today = new Date();
      const first = today.getDate() - today.getDay();
      const start = new Date(today);
      start.setDate(first);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      params.startDate = start.toISOString().split("T")[0];
      params.endDate = end.toISOString().split("T")[0];
    } else if (filterType === "month") {
      params.month = Number(selectedMonth);
      params.year = Number(selectedYear);
    } else if (filterType === "dateRange") {
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
    }

    return params;
  };

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);

      const filters = getFilterParams();
      const blob = await TransactionsService.exportVendorReport(filters);

      if (!(blob instanceof Blob) || blob.size === 0) {
        toast.error("No transactions found for the selected filters");
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `vendor-transaction-report-${new Date().toISOString().split("T")[0]}.pdf`,
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Transaction report downloaded successfully");
    } catch (err) {
      console.error("PDF Download Error:", err);
      toast.error("Failed to download transaction report");
    } finally {
      setIsDownloading(false);
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={12} />
            Paid
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
            <XCircle size={12} />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
            <Clock size={12} />
            {status}
          </span>
        );
    }
  };

  const transactions: VendorTransactionDto[] = data?.transactions || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.currentPage || 1;

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <main className="flex-1 ml-56 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-poppins">
                Transaction History
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitor all incoming EMI repayments and penalty collections
              </p>
            </div>

            <button
              onClick={handleDownloadReport}
              disabled={isDownloading || transactions.length === 0}
              className="group flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isDownloading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download
                  size={18}
                  className="group-hover:-translate-y-0.5 transition-transform"
                />
              )}
              {isDownloading ? "Generating Report..." : "Download Report"}
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Total Collected
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ₹
                {transactions
                  .reduce(
                    (acc: number, curr: VendorTransactionDto) =>
                      acc + curr.totalAmount,
                    0,
                  )
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table Controls & Filters */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search by Transaction ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                  />
                  <ClearSearchButton
                    show={search.length > 0}
                    onClick={handleClearSearch}
                  />
                </div>
                <p className="text-xs font-medium text-slate-400 italic">
                  Showing {transactions.length} items of {data?.total || 0}{" "}
                  transactions
                </p>
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-lg">
                  {(["all", "week", "month", "dateRange"] as const).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          filterType === type
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).replace("Range", " Range")}
                      </button>
                    ),
                  )}
                </div>

                {filterType === "month" && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    >
                      {months.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {filterType === "dateRange" && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
                <p className="text-slate-400 font-medium italic">
                  Loading secure transactions...
                </p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Sync Error
                </h3>
                <p className="text-slate-500 max-w-xs">
                  {error instanceof Error
                    ? error.message
                    : "Failed to fetch vendor records"}
                </p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <DollarSign className="w-12 h-12 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  No Records Found
                </h3>
                <p className="text-slate-500 max-w-xs">
                  No transactions have been processed by your institution yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] bg-slate-50/50">
                      <th className="px-6 py-4">Transaction Details</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Amount Breakdown</th>
                      <th className="px-6 py-4">Total Received</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Execution Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr
                        key={tx.transactionId}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-mono font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                              #{tx.transactionId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                              <User size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-700">
                                {tx.userName}
                              </span>
                              {tx.userEmail && (
                                <span className="text-[11px] text-slate-400">
                                  {tx.userEmail}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">
                                Base:
                              </span>
                              <span className="text-sm font-semibold text-slate-700">
                                ₹{tx.amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">
                                Penalty:
                              </span>
                              <span
                                className={`text-[11px] font-bold ${
                                  tx.penaltyAmount > 0
                                    ? "text-rose-500"
                                    : "text-slate-300"
                                }`}
                              >
                                ₹{tx.penaltyAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-base font-bold text-slate-900 font-poppins">
                            ₹{tx.totalAmount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {getStatusBadge(tx.paymentStatus)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-600">
                              <Calendar size={14} className="text-slate-400" />
                              {new Date(tx.paidAt).toLocaleDateString()}
                            </div>
                            <span className="text-[10px] text-slate-400 italic">
                              {new Date(tx.paidAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && transactions.length > 0 && (
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
                <p className="text-sm text-slate-500 font-medium">
                  Page{" "}
                  <span className="text-slate-900 font-bold">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-slate-900 font-bold">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorTransactionListing;

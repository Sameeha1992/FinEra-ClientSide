import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserApplicationservice } from "@/api/user/user.loan.application";
import type { UserApplicationListItem } from "@/interfaces/user/userApplications/user.application.types";
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
} from "lucide-react";

// ── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<
  string,
  { pill: string; dot: string; label: string }
> = {
  approved: {
    pill: "bg-green-100 text-green-800",
    dot: "bg-green-500",
    label: "Approved",
  },
  pending: {
    pill: "bg-yellow-100 text-yellow-800",
    dot: "bg-yellow-400",
    label: "Pending",
  },
  rejected: {
    pill: "bg-red-100 text-red-800",
    dot: "bg-red-500",
    label: "Rejected",
  },
  disbursed: {
    pill: "bg-blue-100 text-blue-800",
    dot: "bg-blue-500",
    label: "Disbursed",
  },
  processing: {
    pill: "bg-purple-100 text-purple-800",
    dot: "bg-purple-500",
    label: "Processing",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status.toLowerCase();
  const { pill, dot, label } =
    STATUS_STYLES[normalized] ?? STATUS_STYLES["pending"];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot}`} />
      {label}
    </span>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatAmount = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const loanTypeLabels: Record<string, string> = {
  PERSONAL: "Personal Loan",
  HOME: "Home Loan",
  BUSINESS: "Business Loan",
  GOLD: "Gold Loan",
};

// Maps loan type (lowercase) → user-facing form route
const loanTypeToRoute: Record<string, string> = {
  personal: "personal-loan",
  home: "home-loan",
  business: "business-loan",
  gold: "gold-loan",
};

// ── Main Component ────────────────────────────────────────────────────────────
const LIMIT = 10;

const UserApplicationList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleReapply = (app: UserApplicationListItem) => {
    const typeKey = app.loanType.toLowerCase();
    const route = loanTypeToRoute[typeKey];
    if (route) {
      const params = new URLSearchParams({
        applicationId: app.applicationId,
        loanType: app.loanType.toUpperCase(),
      });
      navigate(`/user/${route}?${params.toString()}`);
    } else {
      navigate(`/user/loans?type=${typeKey}`);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userApplications", currentPage],
    queryFn: () =>
      UserApplicationservice.getApplicationList(currentPage, LIMIT),
    placeholderData: (previousData) => previousData,
  });

  const applications: UserApplicationListItem[] = data?.applications ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? Math.ceil(total / LIMIT);

  // Local search filter
  const filtered = search
    ? applications.filter(
        (app) =>
          app.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
          app.loanType.toLowerCase().includes(search.toLowerCase()) ||
          app.status.toLowerCase().includes(search.toLowerCase()),
      )
    : applications;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
          <p className="text-sm text-gray-500">
            Track all your loan applications in one place
          </p>
        </div>
      </div>

      {/* Card container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by application no, type, status…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Summary */}
          <span className="text-sm text-gray-500">
            {total} application{total !== 1 ? "s" : ""} total
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Application No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Loan Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Amount
                </th>
               
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Rejection Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm text-gray-400">
                      Loading applications…
                    </p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <p className="text-sm text-red-500">
                      Failed to load applications. Please try again.
                    </p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-medium">
                      No applications found
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {search
                        ? "Try adjusting your search"
                        : "Your loan applications will appear here"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app.applicationId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Application Number */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-teal-700">
                        #{app.applicationNumber}
                      </span>
                    </td>

                    {/* Loan Type */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-800">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        {loanTypeLabels[app.loanType?.toUpperCase()] ??
                          app.loanType}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-800">
                        {formatAmount(app.loanAmount)}
                      </span>
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(app.appliedDate)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Rejection Reason */}
                    <td className="px-6 py-4">
                      {app.rejectionReason ? (
                        <span className="text-sm text-red-600 italic">
                          {app.rejectionReason}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-300">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      {app.status.toLowerCase() === "rejected" ? (
                        <button
                          onClick={() => handleReapply(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-md transition-colors"
                        >
                          <RotateCcw size={13} />
                          Reapply
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/user/applications/${app.applicationId}`)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium rounded-md transition-colors"
                        >
                          <Eye size={13} />
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: count + pagination */}
        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Showing {Math.min((currentPage - 1) * LIMIT + 1, total)}–
              {Math.min(currentPage * LIMIT, total)} of {total} results
            </p>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 text-xs rounded-md font-medium transition-colors ${
                    p === currentPage
                      ? "bg-teal-600 text-white shadow-sm"
                      : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserApplicationList;

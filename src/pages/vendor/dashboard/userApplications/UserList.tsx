import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";
import { Search, Eye, ChevronLeft, ChevronRight, Users, Loader2 } from "lucide-react";
import { userVerification } from "@/api/vendor/user.verification";
import type { VendorApplicationListItemDTO } from "@/interfaces/vendor/user.verification.interface";
import toast from "react-hot-toast";

// ─── Status Config ─────────────────────────────────────────────────────────────
const getStatusStyle = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "ACTIVE" || s === "APPROVED")
        return { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" };
    if (s === "PENDING")
        return { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" };
    if (s === "REJECTED")
        return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
    return { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
};

const ITEMS_PER_PAGE = 8;

// ─── Component ────────────────────────────────────────────────────────────────
export default function UserList() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<VendorApplicationListItemDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // ── Debounce search (500 ms) ──────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // ── Fetch from API ────────────────────────────────────────────────────────
    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await userVerification.getUserList(
                currentPage,
                ITEMS_PER_PAGE,
                debouncedSearch
            );
            setApplications(res.data);
            setTotal(res.total);
            setTotalPages(res.totalPages);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load user applications");
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // ── Pagination helpers ────────────────────────────────────────────────────
    const startItem = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    const pageNumbers = () => {
        const pages: number[] = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="flex-1 ml-56 p-8">
                {/* ── Page Header ── */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-xl">
                            <Users size={20} className="text-teal-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                User Loan Applications
                            </h1>
                            <p className="text-sm text-slate-500">
                                List of users who have applied for loans through your institution
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Search & Controls ── */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-4 mb-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={16}
                            />
                            <input
                                type="text"
                                placeholder="Search by name, loan type, status..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-600 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <p className="text-sm text-slate-400 whitespace-nowrap">
                            {total} result{total !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    {[
                                        "App No.",
                                        "User Name",
                                        "Loan Type",
                                        "Amount",
                                        "Status",
                                        "Applied Date",
                                        "Action",
                                    ].map((col) => (
                                        <th
                                            key={col}
                                            className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 size={28} className="animate-spin text-teal-500" />
                                                <p className="text-sm text-slate-400">Loading applications…</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100">
                                                    <Users size={24} className="text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 font-medium">No applications found</p>
                                                <p className="text-slate-400 text-sm">
                                                    {debouncedSearch
                                                        ? "Try a different search query"
                                                        : "No users have applied yet"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map((user) => {
                                        const s = getStatusStyle(user.status);
                                        return (
                                            <tr
                                                key={user.applicationId}
                                                className="hover:bg-slate-50/60 transition-colors"
                                            >
                                                {/* App Number */}
                                                <td className="px-5 py-4 text-sm font-mono font-medium text-teal-600">
                                                    {user.applicationNumber}
                                                </td>

                                                {/* User Name */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex-shrink-0">
                                                            {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-800">
                                                            {user.name}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Loan Type */}
                                                <td className="px-5 py-4">
                                                    <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                                                        {user.loanType}
                                                    </span>
                                                </td>

                                                {/* Amount */}
                                                <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                                    ₹{Number(user.loanAmount).toLocaleString("en-IN")}
                                                </td>

                                                {/* Status */}
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                                        {user.status}
                                                    </span>
                                                </td>

                                                {/* Applied Date */}
                                                <td className="px-5 py-4 text-sm text-slate-500">
                                                    {user.appliedDate
                                                        ? new Date(user.appliedDate).toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })
                                                        : "—"}
                                                </td>

                                                {/* Action */}
                                                <td className="px-5 py-4">
                                                    <button
                                                        onClick={() =>
                                                            navigate(`/vendor/user-application/${user.applicationId}`)
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-sm font-medium transition-colors shadow-sm shadow-teal-500/20"
                                                    >
                                                        <Eye size={14} />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ── */}
                    {!loading && total > 0 && (
                        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Showing{" "}
                                <span className="font-semibold text-slate-700">{startItem}</span>
                                {" – "}
                                <span className="font-semibold text-slate-700">{endItem}</span>
                                {" of "}
                                <span className="font-semibold text-slate-700">{total}</span> results
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={15} />
                                    Prev
                                </button>

                                {pageNumbers().map((pg) => (
                                    <button
                                        key={pg}
                                        onClick={() => setCurrentPage(pg)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${pg === currentPage
                                                ? "bg-teal-500 text-white shadow-sm"
                                                : "text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        {pg}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

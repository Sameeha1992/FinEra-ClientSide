import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import heroIllustration from "@/assets/logI.png";
import { loanService } from "@/api/user/userLoanService";
import type { LoanListingItem } from "@/interfaces/user/loans/user.loan.listing";

const loanLabels: Record<string, string> = {
    personal: "Personal Loans",
    home: "Home Loans",
    education: "Education Loans",
    agriculture: "Agriculture Loans",
    business: "Business Loans",
    commercial: "Commercial Loans",
    gold: "Gold Loans",
    vehicle: "Vehicle Loans",
};

interface LoanMeta {
    highlight1: string;
    highlight2: string;
    highlight3: string;
    useCase: string;
}

const loanMeta: Record<string, LoanMeta> = {
    personal: {
        highlight1: "10.5% p.a.",
        highlight2: "₹40 lakh",
        highlight3: "6 years",
        useCase: "weddings, education, travel, or urgent personal needs",
    },
    home: {
        highlight1: "8.5% p.a.",
        highlight2: "₹5 crore",
        highlight3: "30 years",
        useCase: "buying, constructing, or renovating your dream home",
    },
    education: {
        highlight1: "8.15% p.a.",
        highlight2: "₹1.5 crore",
        highlight3: "15 years",
        useCase: "undergraduate, postgraduate, or professional courses in India or abroad",
    },
    agriculture: {
        highlight1: "7% p.a.",
        highlight2: "₹50 lakh",
        highlight3: "7 years",
        useCase: "crop cultivation, farm equipment, irrigation, or land development",
    },
    business: {
        highlight1: "10.25% p.a.",
        highlight2: "₹5 crore",
        highlight3: "10 years",
        useCase: "working capital, business expansion, or equipment purchase",
    },
    commercial: {
        highlight1: "9.75% p.a.",
        highlight2: "₹10 crore",
        highlight3: "15 years",
        useCase: "purchase or construction of commercial properties and warehouses",
    },
    gold: {
        highlight1: "7.5% p.a.",
        highlight2: "₹1 crore",
        highlight3: "3 years",
        useCase: "instant cash against gold jewellery or ornaments with minimal documentation",
    },
    vehicle: {
        highlight1: "8.5% p.a.",
        highlight2: "₹50 lakh",
        highlight3: "7 years",
        useCase: "purchasing a new or used car, two-wheeler, or commercial vehicle",
    },
};

const LIMIT = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatAmount = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(0)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
};

// ─── Component ────────────────────────────────────────────────────────────────
const LoanListingPage = () => {
    const [searchParams] = useSearchParams();
    const rawType = searchParams.get("type")?.toLowerCase() || "personal";
    const loanType = rawType.toUpperCase();                      // for API call
    const loanLabel = loanLabels[rawType] ?? "Personal Loans";   // lowercase key lookup

    const [loans, setLoans] = useState<LoanListingItem[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter inputs (controlled separately so filter only fires on button click)
    const [salaryInput, setSalaryInput] = useState("");
    const [searchInput, setSearchInput] = useState("");

    // Applied filter values (sent to API)
    const [appliedSalary, setAppliedSalary] = useState<number | undefined>(undefined); const [appliedSearch, setAppliedSearch] = useState("");

    const [applied, setApplied] = useState<string | null>(null);

    const totalPages = Math.ceil(total / LIMIT);

    // ── Fetch ───────────────────────────────────────────────────────────
    const fetchLoans = useCallback(
        async (page: number, salary: number | undefined, search: string) => {
            setLoading(true);
            setError(null);
            try {
                const data = await loanService.getLoans(
                    loanType,
                    salary,
                    page,
                    LIMIT,
                    search || undefined,
                );
                console.log(data.loans, "loans")
                setLoans(data.loans);
                setTotal(data.total);
            } catch {
                setError("Failed to load loans. Please try again.");
            } finally {
                setLoading(false);
            }
        },
        [loanType],
    );

    // Re-fetch when loan type changes (reset everything)
    useEffect(() => {
        setCurrentPage(1);
        setAppliedSalary(undefined);
        setAppliedSearch("");
        setSalaryInput("");
        setSearchInput("");
        setApplied(null);
    }, [loanType]); // eslint-disable-line react-hooks/exhaustive-deps

    // Re-fetch on page change
    useEffect(() => {
        fetchLoans(currentPage, appliedSalary, appliedSearch);
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Filter handler ─────────────────────────────────────────────────────────
    const handleFilter = () => {
        const salary = salaryInput ? Number(salaryInput) : undefined;
        setAppliedSalary(salary);
        setAppliedSearch(searchInput);
        setCurrentPage(1);
        fetchLoans(1, salary, searchInput);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            {/* ── Hero ──────────────────────────────────────────────────────────── */}
            <section className="py-14 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 leading-tight mb-4">
                                {loanLabel}
                            </h1>
                            <p className="text-gray-500 text-base leading-relaxed mb-6">
                                {(() => {
                                    const key = rawType.toLowerCase();
                                    const meta = loanMeta[key];
                                    if (!meta) return null;
                                    return (
                                        <>
                                            Discover the best {loanLabel.toLowerCase()} on Finera
                                            with options to compare and apply. Interest rates start
                                            from <strong>{meta.highlight1}</strong>, with loan amounts
                                            up to <strong>{meta.highlight2}</strong> and repayment
                                            tenures of up to <strong>{meta.highlight3}</strong>. Check
                                            eligibility, explore terms, and calculate EMIs to find the
                                            perfect fit. Use it for {meta.useCase}.
                                        </>
                                    );
                                })()}
                            </p>

                        </div>

                        <div className="flex justify-center">
                            <div className="w-72 h-72 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center overflow-hidden">
                                <img
                                    src={heroIllustration}
                                    alt="Loan illustration"
                                    className="w-56 h-56 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Banks Section ─────────────────────────────────────────────────── */}
            <section className="pb-16 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Heading */}
                    <h2 className="text-2xl font-bold text-teal-700 text-center mb-8">
                        Banks Offering {loanLabel}
                    </h2>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <input
                            type="number"
                            placeholder="Enter your salary (₹)"
                            value={salaryInput}
                            onChange={(e) => setSalaryInput(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-teal-300"
                        />
                        <input
                            type="text"
                            placeholder="Search by bank name"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                            className="border border-gray-300 rounded-md px-4 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-teal-300"
                        />
                        <button
                            onClick={handleFilter}
                            className="bg-teal-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
                        >
                            Filter
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Table Head */}
                        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 px-6 py-3">
                            <span className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Bank Name
                            </span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                ROI (p.a.)
                            </span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Processing Fee
                            </span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Loan Amount
                            </span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Tenure
                            </span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Action
                            </span>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="py-16 text-center text-gray-400 text-sm">
                                <div className="inline-block w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p>Loading loan offers...</p>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && !error && loans.length === 0 && (
                            <div className="py-16 text-center text-gray-400 text-sm">
                                No loan offers found
                                {appliedSalary
                                    ? ` for salary ₹${appliedSalary.toLocaleString()}`
                                    : ""}
                                . Try adjusting your filters.
                            </div>
                        )}

                        {/* Rows */}
                        {!loading &&
                            loans.map((loan: LoanListingItem, idx: number) => (
                                <div
                                    key={loan._id}
                                    className={`grid grid-cols-7 px-6 py-4 items-center hover:bg-gray-50 transition-colors ${idx < loans.length - 1 ? "border-b border-gray-100" : ""
                                        }`}
                                >
                                    {/* Bank Name */}
                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {loan.vendor?.vendorName?.charAt(0)?.toUpperCase() ?? "B"}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {loan.vendor?.vendorName ?? "—"}
                                        </span>
                                    </div>

                                    {/* ROI */}
                                    <span className="text-sm text-gray-700">
                                        {loan.interestRate}%
                                    </span>

                                    {/* Processing Fee */}
                                    <span className="text-sm text-gray-700">
                                        {loan.processingFee}%
                                    </span>

                                    {/* Loan Amount */}
                                    <span className="text-sm text-gray-700">
                                        {formatAmount(loan.amount.minimum)}–
                                        {formatAmount(loan.amount.maximum)}
                                    </span>

                                    {/* Tenure */}
                                    <span className="text-sm text-gray-700">
                                        {loan.tenure.minimum}–{loan.tenure.maximum} months
                                    </span>

                                    {/* Apply */}
                                    <div>
                                        {applied === loan._id ? (
                                            <span className="text-teal-600 text-sm font-medium">
                                                ✓ Applied
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setApplied(loan._id)}
                                                className="bg-teal-600 text-white text-sm px-5 py-1.5 rounded-md font-medium hover:bg-teal-700 transition-colors"
                                            >
                                                Apply
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                        {/* Pagination Row */}
                        {!loading && total > LIMIT && (
                            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Showing {(currentPage - 1) * LIMIT + 1}–
                                    {Math.min(currentPage * LIMIT, total)} of {total} results
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (p) => (
                                            <button
                                                key={p}
                                                onClick={() => handlePageChange(p)}
                                                className={`w-7 h-7 text-xs rounded font-medium transition-colors ${p === currentPage
                                                    ? "bg-teal-600 text-white"
                                                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ),
                                    )}
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* end table */}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LoanListingPage;

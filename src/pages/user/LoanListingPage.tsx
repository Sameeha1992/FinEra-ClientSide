import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Home, CreditCard, Building2, Coins } from "lucide-react";
import { loanService } from "@/api/user/userLoanService";
import type { LoanListingItem } from "@/interfaces/user/loans/user.loan.listing";
import { useQuery } from "@tanstack/react-query";

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
    useCase:
      "undergraduate, postgraduate, or professional courses in India or abroad",
  },
  agriculture: {
    highlight1: "7% p.a.",
    highlight2: "₹50 lakh",
    highlight3: "7 years",
    useCase:
      "crop cultivation, farm equipment, irrigation, or land development",
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
    useCase:
      "instant cash against gold jewellery or ornaments with minimal documentation",
  },
  vehicle: {
    highlight1: "8.5% p.a.",
    highlight2: "₹50 lakh",
    highlight3: "7 years",
    useCase: "purchasing a new or used car, two-wheeler, or commercial vehicle",
  },
};

const LIMIT = 10;

// Maps loan type (lowercase) → user-facing route path
const loanTypeToRoute: Record<string, string> = {
  personal: "personal-loan",
  home: "home-loan",
  business: "business-loan",
  gold: "gold-loan",
};

// All loan types for the tab bar
const loanTypes = [
  { key: "personal", label: "Personal", Icon: CreditCard },
  { key: "home", label: "Home", Icon: Home },
  { key: "business", label: "Business", Icon: Building2 },
  { key: "gold", label: "Gold", Icon: Coins },

];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatAmount = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(0)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

// ─── Component ────────────────────────────────────────────────────────────────
const LoanListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawType = searchParams.get("type")?.toLowerCase() || "personal";
  const loanType = rawType.toUpperCase(); // for API call
  const loanLabel = loanLabels[rawType] ?? "Personal Loans"; // lowercase key lookup
  const [currentPage, setCurrentPage] = useState(1);

  // Filter inputs (controlled separately so filter only fires on button click)
  const [salaryInput, setSalaryInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Applied filter values (sent to API)
  const [appliedSalary, setAppliedSalary] = useState<number | undefined>(undefined);
  const [appliedSearch, setAppliedSearch] = useState("");

  const handleTabChange = (typeKey: string) => {
    setSearchParams({ type: typeKey });
    setCurrentPage(1);
    setSalaryInput("");
    setSearchInput("");
    setAppliedSalary(undefined);
    setAppliedSearch("");
  };

  const handleApply = (loan: LoanListingItem) => {
    const route = loanTypeToRoute[rawType];
    if (route) {
      const params = new URLSearchParams({
        loanId: loan._id,
        vendorId: loan.vendor._id,
        loanType: loanType,
        minAmount: String(loan.amount.minimum),
        maxAmount: String(loan.amount.maximum),
        minTenure: String(loan.tenure.minimum),
        maxTenure: String(loan.tenure.maximum),
        minSalary: String(loan.eligibility?.minSalary ?? 0),
      });
      navigate(`/user/${route}?${params.toString()}`);
    }
  };


  // ── Fetch ───────────────────────────────────────────────────────────
  // const fetchLoans = useCallback(
  //     async (page: number, salary: number | undefined, search: string) => {
  //         setLoading(true);
  //         setError(null);
  //         try {
  //             const data = await loanService.getLoans(
  //                 loanType,
  //                 salary,
  //                 page,
  //                 LIMIT,
  //                 search || undefined,
  //             );
  //             console.log(data.loans, "loans")
  //             setLoans(data.loans);
  //             setTotal(data.total);
  //         } catch {
  //             setError("Failed to load loans. Please try again.");
  //         } finally {
  //             setLoading(false);
  //         }
  //     },
  //     [loanType],
  // );

  // Re-fetch when loan type changes (reset everything)

  // useEffect(() => {
  //     setCurrentPage(1);
  //     setAppliedSalary(undefined);
  //     setAppliedSearch("");
  //     setSalaryInput("");
  //     setSearchInput("");
  //     setApplied(null);
  // }, [loanType]); // eslint-disable-line react-hooks/exhaustive-deps

  // // Re-fetch on page change
  // useEffect(() => {
  //     fetchLoans(currentPage, appliedSalary, appliedSearch);
  // }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // // ── Filter handler ─────────────────────────────────────────────────────────
  // const handleFilter = () => {
  //     const salary = salaryInput ? Number(salaryInput) : undefined;
  //     setAppliedSalary(salary);
  //     setAppliedSearch(searchInput);
  //     setCurrentPage(1);
  //     fetchLoans(1, salary, searchInput);
  // };

  // const handlePageChange = (page: number) => {
  //     setCurrentPage(page);
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["loans", loanType, currentPage, appliedSalary, appliedSearch],
    queryFn: () =>
      loanService.getLoans(
        loanType,
        appliedSalary,
        currentPage,
        LIMIT,
        appliedSearch || undefined,
      ),
    placeholderData: (previousData) => previousData,
  });

  const loans: LoanListingItem[] = data?.loans ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const handleFilter = () => {
    const salary = salaryInput ? Number(salaryInput) : undefined;
    setAppliedSalary(salary);
    setAppliedSearch(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h1 className="text-3xl font-bold mb-2">{loanLabel}</h1>
          {(() => {
            const meta = loanMeta[rawType];
            if (!meta) return null;
            return (
              <p className="text-white/75 text-sm max-w-2xl mx-auto">
                Interest from <strong className="text-white">{meta.highlight1}</strong>
                {" · "}Up to <strong className="text-white">{meta.highlight2}</strong>
                {" · "}Tenure up to <strong className="text-white">{meta.highlight3}</strong>
              </p>
            );
          })()}
        </div>
      </section>

      {/* ── Loan Type Tabs ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
            {loanTypes.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${rawType === key
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-gray-500 hover:text-teal-600 hover:border-teal-300"
                  }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

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
          {isError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              Failed to load loans. Please try again.
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
            {isLoading && (
              <div className="py-16 text-center text-gray-400 text-sm">
                <div className="inline-block w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p>Loading loan offers...</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && loans.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">
                No loan offers found
                {appliedSalary
                  ? ` for salary ₹${appliedSalary.toLocaleString()}`
                  : ""}
                . Try adjusting your filters.
              </div>
            )}

            {/* Rows */}
            {!isLoading &&
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

                  {/* Action: Details + Apply */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/user/loans/${loan._id}`)}
                      className="border border-teal-600 text-teal-600 text-sm px-4 py-1.5 rounded-md font-medium hover:bg-teal-50 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleApply(loan)}
                      className="bg-teal-600 text-white text-sm px-4 py-1.5 rounded-md font-medium hover:bg-teal-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}

            {/* Pagination Row */}
            {!isLoading && total > 0 && (
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

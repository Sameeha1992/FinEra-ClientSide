import {
  IndianRupee,
  Percent,
  Clock,
  Calculator,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

// ── Static result row ──────────────────────────────────────────────────────────
interface ResultRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

const ResultRow = ({
  icon,
  label,
  value,
  highlight = false,
}: ResultRowProps) => (
  <div
    className={`flex items-center justify-between p-4 rounded-xl border ${
      highlight
        ? "bg-teal-600 border-teal-600 text-white"
        : "bg-white border-gray-100 text-gray-800"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          highlight ? "bg-white/20" : "bg-teal-50 text-teal-600"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-sm font-medium ${highlight ? "text-white/90" : "text-gray-600"}`}
      >
        {label}
      </span>
    </div>
    <span
      className={`text-base font-bold ${highlight ? "text-white" : "text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

// ── Static input field ─────────────────────────────────────────────────────────
interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  suffix?: string;
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  icon,
  label,
  placeholder,
  suffix,
  value,
  onChange,
}: InputFieldProps) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div className="relative flex items-center">
      <div className="absolute left-3 w-5 h-5 text-teal-500">{icon}</div>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-14 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition"
      />
      {suffix && (
        <span className="absolute right-3 text-xs font-semibold text-gray-400">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const EMICalculator = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">("");
  const [tenure, setTenure] = useState<number | "">("");

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  const calculateEMI = () => {
    if (!amount || !rate || !tenure) return;

    const P = amount;
    const R = rate / 12 / 100;
    const N = tenure;

    const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);

    const totalPay = emiValue * N;
    const interest = totalPay - P;

    setEmi(emiValue);
    setTotalPayment(totalPay);
    setTotalInterest(interest);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">EMI Calculator</h1>
          </div>
          <p className="text-white/75 text-sm max-w-md mx-auto">
            Estimate your monthly EMI instantly. Enter your loan details below
            to get a quick breakdown of your repayment plan.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* ── Input Section ── */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-sm font-bold text-teal-700 uppercase tracking-widest mb-5">
              Loan Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <InputField
                icon={<IndianRupee className="w-4 h-4" />}
                label="Loan Amount"
                placeholder="e.g. 500000"
                suffix="₹"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
              <InputField
                icon={<Percent className="w-4 h-4" />}
                label="Interest Rate"
                placeholder="e.g. 10.5"
                suffix="% p.a."
                value={rate}
                onChange={(e) =>
                  setRate(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
              <InputField
                icon={<Clock className="w-4 h-4" />}
                label="Loan Tenure"
                placeholder="e.g. 36"
                suffix="mo"
                value={tenure}
                onChange={(e) =>
                  setTenure(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>

            {/* Calculate Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={calculateEMI}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Calculate EMI
              </button>
            </div>
          </div>

          {/* ── Result Section ── */}
          <div className="p-6">
            <h2 className="text-sm font-bold text-teal-700 uppercase tracking-widest mb-5">
              Repayment Summary
            </h2>

            <div className="space-y-3">
              <ResultRow
                icon={<IndianRupee className="w-4 h-4" />}
                label="Monthly EMI"
                value={emi ? `₹ ${emi.toFixed(2)}` : "₹ —"}
                highlight
              />
              <ResultRow
                icon={<Wallet className="w-4 h-4" />}
                label="Principal Amount"
                value={amount ? `₹ ${amount}` : "₹ —"}
              />
              <ResultRow
                icon={<TrendingUp className="w-4 h-4" />}
                label="Total Interest Payable"
                value={totalInterest ? `₹ ${totalInterest.toFixed(2)}` : "₹ —"}
              />
              <ResultRow
                icon={<IndianRupee className="w-4 h-4" />}
                label="Total Amount Payable"
                value={totalPayment ? `₹ ${totalPayment.toFixed(2)}` : "₹ —"}
              />
            </div>

            {/* Donut placeholder */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="relative w-36 h-36">
                {/* Static donut ring */}
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {/* Background ring */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3.5"
                  />
                  {/* Principal arc (static ~60%) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="3.5"
                    strokeDasharray="60 40"
                    strokeLinecap="round"
                  />
                  {/* Interest arc (static ~40%) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#5eead4"
                    strokeWidth="3.5"
                    strokeDasharray="40 60"
                    strokeDashoffset="-60"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400 font-medium">
                    Breakdown
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
                  Principal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-300 inline-block" />
                  Interest
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info note */}
        <p className="mt-4 text-center text-xs text-gray-400">
          * This is an indicative calculation. Actual EMI may vary based on
          lender terms.
        </p>
      </main>
    </div>
  );
};

export default EMICalculator;

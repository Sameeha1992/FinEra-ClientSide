import React, { useEffect, useState } from "react";
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { loanProduct } from "@/api/loanProduct/loanProduct.service";

import type { ILoanProductDto } from "@/interfaces/addLoan/loanProduct.dto";

export default function LoanEditForm() {
  const [formData, setFormData] = useState<ILoanProductDto>({
    name: "",
    loanType: "",
    description: "",
    interestRate: 0,
    duePenalty: 0,
    processingFee: 0,
    amount: { minimum: 0, maximum: 0 },
    tenure: { minimum: 0, maximum: 0 },
    eligibility: { minAge: 0, maxAge: 0, minSalary: 0, minCibilScore: 0 },
    status: "ACTIVE",
  });

  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchLoan = async () => {
      if (!loanId) {
        toast.error("LoanId is missing");
        return null
      };
      try {
        const loan = await loanProduct.getLoanById(loanId);
        setFormData({
          name: loan.name,
          loanType: loan.loanType || "",
          description: loan.description,
          interestRate: loan.interestRate,
          duePenalty: loan.duePenalty,
          processingFee: loan.processingFee ?? 0,
          amount: {
            minimum: loan.amount.minimum,
            maximum: loan.amount.maximum,
          },
          tenure: {
            minimum: loan.tenure.minimum,
            maximum: loan.tenure.maximum,
          },
          eligibility: {
            minAge: loan.eligibility?.minAge || 0,
            maxAge: loan.eligibility?.maxAge || 0,
            minSalary: loan.eligibility?.minSalary || 0,
            minCibilScore: loan.eligibility?.minCibilScore || 0,
          },
          status: loan.status,
        });
      } catch (error) {
        toast.error(typeof error === "string" ? error : "Failed to fetch loan details")
      }
    };
    fetchLoan()
  }, [loanId, navigate])



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: type === "number" ? (value === "" ? "" : Number(value)) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
      }));
    }
  }

  const loanTypes = [
    "PERSONAL",
    "GOLD",
    "HOME",
    "AGRICULTURAL",
    "EDUCATION"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loanId) {
      toast.error("LoanId is missing");
      return;
    }

    try {

      await loanProduct.updateloans(loanId, formData);
      toast.success("Loan updated successfully");
      navigate("/vendor/loans")
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Update failed");
    }
  };




  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    }));
  };


  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Fixed Position */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-56 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Edit Loan Product
              </h1>
              <p className="text-slate-500 mt-1">
                Update loan details and settings.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Form Header */}
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-700">
                Loan Information
              </h2>
            </div>

            <div className="p-8">
              <form className="space-y-8">
                {/* ── Basic Info ── */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Basic Information</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Loan Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Loan Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                        placeholder="e.g. Personal Loan"
                      />
                    </div>

                    {/* Loan Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Loan Type
                      </label>
                      <select
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700 bg-white"
                      >
                        <option value="" disabled>Select Loan Type</option>
                        {loanTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700 resize-none"
                      placeholder="Enter loan description..."
                    />
                  </div>
                </div>

                {/* ── Rates & Fees ── */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Rates &amp; Fees</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Interest Rate */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Interest Rate (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="interestRate"
                          value={formData.interestRate}
                          onChange={handleChange}
                          className="w-full px-4 pr-10 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                          placeholder="0.00"
                        />
                        <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-medium">%</span>
                      </div>
                    </div>

                    {/* Due Penalty */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Due Penalty (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="duePenalty"
                          value={formData.duePenalty}
                          onChange={handleChange}
                          className="w-full px-4 pr-10 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                          placeholder="0.00"
                        />
                        <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-medium">%</span>
                      </div>
                    </div>

                    {/* Processing Fee */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Processing Fee (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="processingFee"
                          value={formData.processingFee}
                          onChange={handleChange}
                          className="w-full px-4 pr-10 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                          placeholder="0.00"
                        />
                        <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-medium">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Loan Amount ── */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Loan Amount</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Minimum Amount */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Minimum Amount (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                        <input
                          type="number"
                          name="amount.minimum"
                          value={formData.amount.minimum}
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Maximum Amount */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Maximum Amount (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-2.5 text-slate-400 font-medium">₹</span>
                        <input
                          type="number"
                          name="amount.maximum"
                          value={formData.amount.maximum}
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Tenure ── */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Tenure</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Min Tenure (Months)
                      </label>
                      <input
                        type="number"
                        name="tenure.minimum"
                        value={formData.tenure.minimum}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                        placeholder="e.g. 6"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Max Tenure (Months)
                      </label>
                      <input
                        type="number"
                        name="tenure.maximum"
                        value={formData.tenure.maximum}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                        placeholder="e.g. 60"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Eligibility Criteria ── */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Eligibility Criteria</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Min Age */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Min Age</label>
                      <input
                        type="number"
                        name="eligibility.minAge"
                        value={formData.eligibility?.minAge}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                        placeholder="e.g. 21"
                      />
                    </div>

                    {/* Max Age */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Max Age</label>
                      <input
                        type="number"
                        name="eligibility.maxAge"
                        value={formData.eligibility?.maxAge}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                        placeholder="e.g. 60"
                      />
                    </div>

                    {/* Min Salary */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Min Salary (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">₹</span>
                        <input
                          type="number"
                          name="eligibility.minSalary"
                          value={formData.eligibility?.minSalary}
                          onChange={handleChange}
                          className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* CIBIL Score */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CIBIL Score</label>
                      <input
                        type="number"
                        name="eligibility.minCibilScore"
                        value={formData.eligibility?.minCibilScore}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                        placeholder="e.g. 700"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <h3 className="font-medium text-slate-700">Loan Status</h3>
                    <p className="text-sm text-slate-500">
                      Enable or disable this loan product.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${formData.status === "ACTIVE" ? "text-green-600" : "text-slate-500"}`}
                    >
                      {formData.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                    <button
                      type="button"
                      onClick={toggleStatus}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${formData.status ? "bg-green-500" : "bg-slate-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${formData.status ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors shadow-sm shadow-teal-500/30"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

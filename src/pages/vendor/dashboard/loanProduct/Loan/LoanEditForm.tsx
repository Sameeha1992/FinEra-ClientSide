import React, { useState } from "react";
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";

export default function LoanEditForm() {
    const [formData, setFormData] = useState({
        loanName: "Personal Loan",
        interestRate: 12.5,
        minimumAmount: 10000,
        maximumAmount: 500000,
        tenure: 24,
        processingFee: 2,
        description: "A flexible personal loan for your needs.",
        minAge: 21,
        maxAge: 60,
        minSalary: 25000,
        maxSalary: 0,
        status: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) : value,
        }));
    };

    const toggleStatus = () => {
        setFormData((prev) => ({ ...prev, status: !prev.status }));
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
                            <h1 className="text-2xl font-bold text-slate-800">Edit Loan Product</h1>
                            <p className="text-slate-500 mt-1">Update loan details and settings.</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Form Header */}
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-lg font-semibold text-slate-700">Loan Information</h2>
                        </div>

                        <div className="p-8">
                            <form className="space-y-6">

                                {/* Loan Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Loan Name
                                    </label>
                                    <input
                                        type="text"
                                        name="loanName"
                                        value={formData.loanName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                        placeholder="e.g. Personal Loan"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                                placeholder="0.00"
                                            />
                                            <span className="absolute right-4 top-2.5 text-slate-400 font-medium">%</span>
                                        </div>
                                    </div>

                                    {/* Processing Fee */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Processing Fee
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-2.5 text-slate-400 font-medium">$</span>
                                            <input
                                                type="number"
                                                name="processingFee"
                                                value={formData.processingFee}
                                                onChange={handleChange}
                                                className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Minimum Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Minimum Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-2.5 text-slate-400 font-medium">$</span>
                                            <input
                                                type="number"
                                                name="minimumAmount"
                                                value={formData.minimumAmount}
                                                onChange={handleChange}
                                                className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Maximum Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Maximum Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-2.5 text-slate-400 font-medium">$</span>
                                            <input
                                                type="number"
                                                name="maximumAmount"
                                                value={formData.maximumAmount}
                                                onChange={handleChange}
                                                className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tenure */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tenure (Months)
                                    </label>
                                    <input
                                        type="number"
                                        name="tenure"
                                        value={formData.tenure}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                        placeholder="Enter months"
                                    />
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
                                        rows={4}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700 resize-none"
                                        placeholder="Enter loan description..."
                                    />
                                </div>

                                {/* Eligibility - Age & Salary */}
                                <h3 className="text-md font-semibold text-slate-700 mb-2">Eligibility Criteria</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Age Criteria */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-slate-700">Age Criteria</h3>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-500 mb-1">Min Age</label>
                                                <input
                                                    type="number"
                                                    name="minAge"
                                                    value={formData.minAge}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                                    placeholder="Min"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-500 mb-1">Max Age</label>
                                                <input
                                                    type="number"
                                                    name="maxAge"
                                                    value={formData.maxAge}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                                    placeholder="Max"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Salary Criteria */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-slate-700">Salary Criteria</h3>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-500 mb-1">Min Salary</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-xs">$</span>
                                                    <input
                                                        type="number"
                                                        name="minSalary"
                                                        value={formData.minSalary}
                                                        onChange={handleChange}
                                                        className="w-full pl-6 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                                        placeholder="Min"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-500 mb-1">Max Salary</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-xs">$</span>
                                                    <input
                                                        type="number"
                                                        name="maxSalary"
                                                        value={formData.maxSalary}
                                                        onChange={handleChange}
                                                        className="w-full pl-6 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-slate-700"
                                                        placeholder="Max"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Status Toggle */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                        <h3 className="font-medium text-slate-700">Loan Status</h3>
                                        <p className="text-sm text-slate-500">Enable or disable this loan product.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-medium ${formData.status ? 'text-green-600' : 'text-slate-500'}`}>
                                            {formData.status ? 'Active' : 'Inactive'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={toggleStatus}
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${formData.status ? 'bg-green-500' : 'bg-slate-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${formData.status ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-100">
                                    <button
                                        type="button" // Change to submit if handling submission
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

import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../components/vendor/dashboard/shared/Sidebar";
import {
  Search,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { loanProduct } from "@/api/loanProduct/loanProduct.service";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Loan {
  id: string;
  loanId: string;
  name: string;
  loanType: string;
  minAmount: string;
  maxAmount: string;
  interest: string;
  tenure: string;
  status: "Active" | "Inactive";
}

interface ConfirmModal {
  open: boolean;
  loanId: string;
  loanName: string;
  currentStatus: "Active" | "Inactive";
}

export default function LoanListing() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModal>({
    open: false,
    loanId: "",
    loanName: "",
    currentStatus: "Active",
  });

  const [toggling, setToggling] = useState(false);
  const navigate = useNavigate();

  const {isProfileComplete} = useSelector((state:RootState)=>state.auth);
  
  const handleAddLoan =()=>{
    if(!isProfileComplete){
      toast.error("Complete your profile before adding a loan product");
      navigate("/vendor/vendor-profile")
      return;
    }
    navigate("/vendor/add-loan")
  }

  const openConfirmModal = (loanId: string, loanName: string, currentStatus: "Active" | "Inactive") => {
    setConfirmModal({ open: true, loanId, loanName, currentStatus });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ open: false, loanId: "", loanName: "", currentStatus: "Active" });
  };

  const handleConfirmToggle = async () => {
    const { loanId, currentStatus } = confirmModal;
    const newStatus = currentStatus === "Active" ? "INACTIVE" : "ACTIVE";
    const newStatusLabel = currentStatus === "Active" ? "Inactive" : "Active";

    setToggling(true);

    // Optimistic UI update — flip instantly
    setLoans((prev) =>
      prev.map((loan) =>
        loan.loanId === loanId ? { ...loan, status: newStatusLabel as "Active" | "Inactive" } : loan
      )
    );

    closeConfirmModal();

    try {
      await loanProduct.toggleLoanStatus(loanId, newStatus);
      toast.success(`Loan ${newStatusLabel === "Active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      // Revert on failure
      setLoans((prev) =>
        prev.map((loan) =>
          loan.loanId === loanId ? { ...loan, status: currentStatus } : loan
        )
      );
      toast.error(typeof error === "string" ? error : "Failed to update status");
    } finally {
      setToggling(false);
    }
  };

  const fetchLoans = async () => {
    setLoading(true);

    try {
      const response = await loanProduct.getVendorLoans(
        searchTerm,
        page,
        limit
      );

      console.log(response, "responses of list")

      const formattedLoans: Loan[] = response.loans.map((loan) => ({
        id: loan.loanId,
        loanId: loan.loanId,
        name: loan.name,
        loanType: loan.loanType,
        minAmount: loan.amount,
        maxAmount: loan.amount,
        interest: loan.interestRate,
        tenure: loan.tenure,
        status: loan.status === "ACTIVE" ? "Active" : "Inactive",
      }));

      console.log(formattedLoans, "this are the formatred loans")
      setLoans(formattedLoans);
      setTotal(response.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);


  useEffect(() => {
    const handler = setTimeout(() => {
      fetchLoans();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, page, limit]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 ml-56 p-8">
        {/* Top Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search by Application"
                className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
            </div>

            <button onClick={handleAddLoan} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm shadow-teal-500/20">
              <Plus size={18} />
              Add Loan
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    LoanId
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Loan Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Loan Type
                  </th>
                  
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                   Loan Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tenure (month)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-slate-600">
                      Loading...
                    </td>
                  </tr>
                ) : loans.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-slate-600">
                      No loans found
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {loan.loanId}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {loan.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 uppercase">
                        {loan.loanType}
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {loan.maxAmount}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {loan.interest}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {loan.tenure}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${loan.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                            }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/vendor/loan-detail/${loan.loanId}`)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-sm font-medium"
                          >
                            <Eye size={16} /> View
                          </button>
                          <button onClick={() => navigate(`/vendor/edit-loans/${loan.loanId}`)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-sm font-medium">
                            <Edit size={16} /> Edit
                          </button>
                          {loan.status === "Active" ? (
                            <button
                              onClick={() => openConfirmModal(loan.loanId, loan.name, loan.status)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
                            >
                              <XCircle size={16} /> Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => openConfirmModal(loan.loanId, loan.name, loan.status)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium transition-colors"
                            >
                              <CheckCircle size={16} /> Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded hover:bg-slate-100 text-slate-600 text-sm font-medium"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm font-medium">{page}</span>

              <button
                className="px-3 py-1 rounded hover:bg-slate-100 text-slate-600 text-sm font-medium"
                disabled={page * limit >= total}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeConfirmModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 flex flex-col items-center gap-5">
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full ${confirmModal.currentStatus === "Active" ? "bg-red-100" : "bg-emerald-100"
                }`}
            >
              <AlertTriangle
                size={32}
                className={confirmModal.currentStatus === "Active" ? "text-red-500" : "text-emerald-500"}
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {confirmModal.currentStatus === "Active" ? "Deactivate Loan?" : "Activate Loan?"}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Are you sure you want to{" "}
                <span className="font-semibold text-slate-700">
                  {confirmModal.currentStatus === "Active" ? "deactivate" : "activate"}
                </span>{" "}
                the loan <span className="font-semibold text-slate-700">"{confirmModal.loanName}"</span>?
                {confirmModal.currentStatus === "Active" && (
                  <span className="block mt-2 text-red-500 text-xs">
                    This will make the loan unavailable to applicants.
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={closeConfirmModal}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmToggle}
                disabled={toggling}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-60 ${confirmModal.currentStatus === "Active"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
              >
                {confirmModal.currentStatus === "Active" ? "Yes, Deactivate" : "Yes, Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Lock, Unlock, AlertTriangle } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import AdminLayout from "@/components/layout/Adminlayout";
import { fetchAccounts, updateAccountStatus } from "@/api/admin/AdminAccountMgt";
import type { Account } from "@/interfaces/admin/Account";



const VendorManagement = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    accountId: string;
    accountName: string;
    currentStatus: "blocked" | "unblocked";
  }>({ open: false, accountId: "", accountName: "", currentStatus: "unblocked" });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await fetchAccounts({
          page: currentPage,
          limit: itemsPerPage,
          search,
          role: "vendor",
        });

        setAccounts(res.data);
        setTotalResults(res.total);
      } catch (error) {
        console.error("Failed to fetch accounts", error);
      }
    };

    loadAccounts();
  }, [currentPage, search]);



  const openConfirm = (accountId: string, accountName: string, currentStatus: "blocked" | "unblocked") => {
    setConfirmModal({ open: true, accountId, accountName, currentStatus });
  };

  const closeConfirm = () => {
    setConfirmModal({ open: false, accountId: "", accountName: "", currentStatus: "unblocked" });
  };

  const handleToggleStatus = async () => {
    const { accountId, currentStatus } = confirmModal;
    const newStatus: "blocked" | "unblocked" = currentStatus === "unblocked" ? "blocked" : "unblocked";
    closeConfirm();
    try {
      await updateAccountStatus(accountId, newStatus, "vendor");
      // Optimistically update the correct field: accountStatus
      setAccounts(prev =>
        prev.map(acc =>
          acc.id === accountId ? { ...acc, accountStatus: newStatus } : acc
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };


  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Vendor Records</h2>

        <div className="overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Registration No</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {accounts.map(account => (
                <tr key={account.id} className="border-b">
                  <td className="px-4 py-4">{account.vendorId}</td>
                  <td className="px-4 py-4">{account.vendorName ?? account.name ?? "-"}</td>
                  <td className="px-4 py-4">{account.email}</td>
                  <td className="px-4 py-4">
                    {account.registrationNumber ?? "-"}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={account.accountStatus} />
                  </td>
                  <td className="px-4 py-4">
                    <ActionButton
                      onClick={() => openConfirm(account.id, account.vendorName ?? account.name ?? "", account.accountStatus)}
                      label={account.accountStatus === "unblocked" ? "Block" : "Unblock"}
                      icon={
                        account.accountStatus === "unblocked" ? (
                          <Lock size={14} />
                        ) : (
                          <Unlock size={14} />
                        )
                      }
                      variant={account.accountStatus === "unblocked" ? "danger" : "success"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ── Confirmation Modal ── */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeConfirm}
          />
          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 flex flex-col items-center gap-5">
            {/* Icon */}
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full ${confirmModal.currentStatus === "unblocked" ? "bg-red-100" : "bg-emerald-100"
                }`}
            >
              <AlertTriangle
                size={32}
                className={confirmModal.currentStatus === "unblocked" ? "text-red-500" : "text-emerald-500"}
              />
            </div>
            {/* Text */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {confirmModal.currentStatus === "unblocked" ? "Block Vendor?" : "Unblock Vendor?"}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Are you sure you want to{" "}
                <span className="font-semibold text-slate-700">
                  {confirmModal.currentStatus === "unblocked" ? "block" : "unblock"}
                </span>{" "}
                the vendor{" "}
                <span className="font-semibold text-slate-700">"{confirmModal.accountName}"</span>?
                {confirmModal.currentStatus === "unblocked" && (
                  <span className="block mt-2 text-red-500 text-xs">
                    This will prevent the vendor from accessing the platform.
                  </span>
                )}
              </p>
            </div>
            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={closeConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors ${confirmModal.currentStatus === "unblocked"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
              >
                {confirmModal.currentStatus === "unblocked" ? "Yes, Block" : "Yes, Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default VendorManagement;

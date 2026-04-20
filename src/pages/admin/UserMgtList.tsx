import { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { fetchAccounts } from "@/api/admin/AdminAccountMgt";
import { useDebounce } from "@/hooks/useDebounce";
import ClearSearchButton from "@/components/ui/ClearSearchButton";
import type { Account } from "@/interfaces/admin/Account";
import Pagination from "@/components/ui/Pagination";
import AdminLayout from "@/components/layout/Adminlayout";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionButton from "@/components/ui/ActionButton";
import { updateAccountStatus } from "@/api/admin/AdminAccountMgt";
import toast from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const UserManagement = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [selectedAccount, setSelectedAccount] = useState<{
    id: string;
    accountStatus: "blocked" | "unblocked";
    name: string;
  } | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await fetchAccounts({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          role: "user",
        });

        setAccounts(res.data);
        setTotalResults(res.total);
      } catch (error) {
        console.error("Failed to fetch accounts", error);
      }
    };

    loadAccounts();
  }, [currentPage, debouncedSearch]);

  //   const handleToggleStatus = async (accountId: string, currentStatus: "active"|"blocked") => {
  //   try {
  //     const newStatus = currentStatus === "active" ? "blocked" : "active";

  //     await updateAccountStatus(
  //       accountId,
  //       newStatus,
  //       "user"
  //     );

  //     setAccounts(prev =>
  //       prev.map(acc =>
  //         acc.id === accountId
  //           ? { ...acc, status: newStatus }
  //           : acc
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Failed to update status", error);
  //   }
  // };

  const confirmStatusChange = async (): Promise<void> => {
    if (!selectedAccount) return;

    const newStatus: "blocked" | "unblocked" =
      selectedAccount.accountStatus === "unblocked" ? "blocked" : "unblocked";

    try {
      await updateAccountStatus(selectedAccount.id, newStatus, "user");

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === selectedAccount.id
            ? { ...acc, accountStatus: newStatus }
            : acc,
        ),
      );

      toast.success(
        `${selectedAccount.name} has been ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update status";

      toast.error(message);
    }
    setSelectedAccount(null);
  };

  const handleClearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">User Records</h2>

        <div className="overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-64 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 pr-10"
              />
              <ClearSearchButton
                show={search.length > 0}
                onClick={handleClearSearch}
              />
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b">
                  <td className="px-4 py-4">{account.customerId}</td>
                  <td className="px-4 py-4">{account.name}</td>
                  <td className="px-4 py-4">{account.email}</td>

                  <td className="px-4 py-4">
                    <StatusBadge status={account.accountStatus} />
                  </td>
                  <td className="px-4 py-4">
                    <ActionButton
                      onClick={() =>
                        setSelectedAccount({
                          id: account.id,
                          accountStatus: account.accountStatus,
                          name: account.name,
                        })
                      }
                      label={
                        account.accountStatus === "unblocked"
                          ? "Block"
                          : "Unblock"
                      }
                      icon={
                        account.accountStatus === "unblocked" ? (
                          <Lock size={14} />
                        ) : (
                          <Unlock size={14} />
                        )
                      }
                      variant={
                        account.accountStatus === "unblocked"
                          ? "danger"
                          : "success"
                      }
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

      <AlertDialog
        open={!!selectedAccount}
        onOpenChange={(open) => {
          if (!open) setSelectedAccount(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              <span className="font-semibold">
                {selectedAccount?.accountStatus === "unblocked"
                  ? "block"
                  : "unblock"}
              </span>{" "}
              <span className="font-semibold text-teal-600">
                {selectedAccount?.name}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmStatusChange}
              className={
                selectedAccount?.accountStatus === "unblocked"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              Yes, Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default UserManagement;

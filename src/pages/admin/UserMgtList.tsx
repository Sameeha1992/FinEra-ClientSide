import { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { fetchAccounts } from "@/api/admin/AdminAccountMgt";
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

  const [selectedAccount, setSelectedAccount] = useState<{
    id: string;
    status: "active" | "blocked";
    name: string;
  } | null>(null)

  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalResults / itemsPerPage);


  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await fetchAccounts({
          page: currentPage,
          limit: itemsPerPage,
          search,
          role: "user",
        });

        setAccounts(res.data);
        setTotalResults(res.total);
      } catch (error) {
        console.error("Failed to fetch accounts", error);
      }
    };

    loadAccounts();
  }, [currentPage, search]);


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

    const newStatus: "active" | "blocked" =
      selectedAccount.status === "active" ? "blocked" : "active";

    try {
      await updateAccountStatus(selectedAccount.id, newStatus, "user");

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === selectedAccount.id ? { ...acc, status: newStatus } : acc
        )
      );

      toast.success(
        `${selectedAccount.name} has been ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
    setSelectedAccount(null);
  }



  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">User Records</h2>

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
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {accounts.map(account => (
                <tr key={account.id} className="border-b">
                  <td className="px-4 py-4">{account.id}</td>
                  <td className="px-4 py-4">{account.name}</td>
                  <td className="px-4 py-4">{account.email}</td>

                  <td className="px-4 py-4">
                    <StatusBadge status={account.status} />
                  </td>
                  <td className="px-4 py-4">
                    <ActionButton
                      onClick={() => setSelectedAccount({ id: account.id, status: account.status, name: account.name })}
                      label={account.status === "active" ? "Block" : "Unblock"}
                      icon={
                        account.status === "active" ? (
                          <Lock size={14} />
                        ) : (
                          <Unlock size={14} />
                        )
                      }
                      variant={account.status === "active" ? "danger" : "success"}
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
            <AlertDialogTitle>
              Confirm Action
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              <span className="font-semibold">
                {selectedAccount?.status === "active" ? "block" : "unblock"}
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
                selectedAccount?.status === "active"
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

import { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
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
  }, [currentPage,search]);


  
    const handleToggleStatus = async (accountId: string, currentStatus: "active"|"blocked") => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
  
      await updateAccountStatus(
        accountId,
        newStatus,
        "vendor" 
      );
  
     
      setAccounts(prev =>
        prev.map(acc =>
          acc.id === accountId
            ? { ...acc, status: newStatus }
            : acc
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
                  <td className="px-4 py-4">{account.id}</td>
                  <td className="px-4 py-4">{account.name}</td>
                  <td className="px-4 py-4">{account.email}</td>
                  <td className="px-4 py-4">
                    {account.registrationNumber ?? "-"}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={account.status} />
                  </td>
                  <td className="px-4 py-4">
                    <ActionButton
                    onClick={() => handleToggleStatus(account.id,account.status)}
                      label={account.status === "active" ? "Block" : "Unblock"}
                      icon={
                        account.status === "active" ? (
                          <Lock size={14} />
                        ) : (
                          <Unlock size={14} />
                        )
                      }
                      variant={
                        account.status === "active" ? "danger" : "success"
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
    </AdminLayout>
  );
};

export default VendorManagement;
